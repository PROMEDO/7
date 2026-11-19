/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  Lightbulb,
  ShoppingBag,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { formatNumber } from '../../utils/storage';
import { fetchDashboardTelegramStatusApi } from '../../utils/adminApi';
import { DEFAULT_MEDIA_ASSETS } from '../../utils/businessDefaults';
import { Ml7Text } from '../../components/Ml7Text';
import { useDashboard } from './DashboardContext';

export const HomePage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const {
    rest,
    resolvedPlan,
    terms,
    allCategories,
    allItems,
    allOrders,
    currency,
    setActiveTab,
    activeRid,
    mainRid,
  } = useDashboard();

  const defaultMedia =
    terms.isStore ? DEFAULT_MEDIA_ASSETS.store : DEFAULT_MEDIA_ASSETS.restaurant;
  const hasCustomLogo = Boolean(rest.logo && rest.logo !== defaultMedia.logo);
  const hasCustomBanner = Boolean(rest.coverImages?.[0] && rest.coverImages[0] !== defaultMedia.banner);
  const hasRichBio = Boolean(rest.aboutText && rest.aboutText.trim().length >= 35);
  const hasSocialLinks = Boolean(
    rest.social?.instagram || rest.social?.tiktok || rest.social?.facebook || rest.mapUrl
  );
  const hasCustomSlugConfigured = Boolean(rest.slug || rest.subdomain);
  const itemsWithPhotoCount = allItems.filter((item) => Boolean(item.img && item.img.trim())).length;
  const hasItemsPhotos = allItems.length >= 3 && itemsWithPhotoCount >= Math.min(allItems.length, 3);
  const hasWhatsappConfigured = Boolean(
    (rest.ph && rest.ph.trim().length >= 8) ||
      (rest.social?.whatsapp && rest.social.whatsapp.trim().length >= 8)
  );
  const hasWorkHoursConfigured = Boolean(rest.weeklyHours && Object.keys(rest.weeklyHours).length > 0);
  const hasDeliveryZonesConfigured = Boolean(
    Array.isArray(rest.deliveryZones) && rest.deliveryZones.length > 0
  );
  const targetTelegramRid = activeRid || mainRid || rest.id;
  const [serverTelegramLinked, setServerTelegramLinked] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    if (!targetTelegramRid) return;
    void fetchDashboardTelegramStatusApi(targetTelegramRid)
      .then((res) => {
        if (active && typeof res?.linked === 'boolean') {
          setServerTelegramLinked(res.linked);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [targetTelegramRid, rest.telegramPhone, rest.telegramUnlinkedManually]);

  const hasTelegramConnected = Boolean(
    serverTelegramLinked ||
      rest.telegramLinked ||
      (rest.telegramChatId && String(rest.telegramChatId).trim()) ||
      (rest.telegramPhone && String(rest.telegramPhone).trim() && rest.telegramUnlinkedManually !== true)
  );
  const hasMapLocation = Boolean(rest.mapUrl && rest.mapUrl.trim());

  interface MenuTip {
    id: string;
    done: boolean;
    label: string;
    targetTab: 'cats' | 'menu' | 'set' | 'qr' | 'appearance' | 'telegram';
  }

  const dynamicTips: MenuTip[] = [
    {
      id: 'cats',
      done: allCategories.length >= 3,
      label:
        allCategories.length >= 3
          ? `الأقسام منظمة (${allCategories.length} أقسام)`
          : `أضف 3 أقسام على الأقل (${allCategories.length}/3)`,
      targetTab: 'cats',
    },
    {
      id: 'items',
      done: allItems.length >= 6,
      label:
        allItems.length >= 6
          ? `${terms.itemsPlural} مكتملة (${allItems.length})`
          : `أضف 6 ${terms.itemsPlural} على الأقل (${allItems.length}/6)`,
      targetTab: 'menu',
    },
    {
      id: 'itemImages',
      done: hasItemsPhotos,
      label: hasItemsPhotos
        ? 'تمت إضافة صور واضحة للأصناف'
        : `أضف صوراً للأصناف (${Math.min(itemsWithPhotoCount, 3)}/3)`,
      targetTab: 'menu',
    },
    {
      id: 'whatsapp',
      done: hasWhatsappConfigured,
      label: hasWhatsappConfigured
        ? 'رقم الواتساب لاستقبال الطلبات مفعّل'
        : 'إضافة رقم واتساب لاستقبال الطلبات',
      targetTab: 'set',
    },
    {
      id: 'media',
      done: hasCustomLogo && hasCustomBanner,
      label:
        hasCustomLogo && hasCustomBanner
          ? 'تم رفع الشعار والغلاف'
          : 'رفع الشعار وصورة الغلاف',
      targetTab: 'set',
    },
    {
      id: 'hours',
      done: hasWorkHoursConfigured,
      label: hasWorkHoursConfigured
        ? 'أوقات وساعات الدوام مضبوطة'
        : 'ضبط أوقات وساعات الدوام',
      targetTab: 'set',
    },
    ...(rest.enabledOrderTypes?.delivery !== false
      ? [
          {
            id: 'deliveryZones',
            done: hasDeliveryZonesConfigured,
            label: hasDeliveryZonesConfigured
              ? 'مناطق وأسعار التوصيل محددة'
              : 'تحديد مناطق وأسعار التوصيل',
            targetTab: 'set' as const,
          },
        ]
      : []),
    {
      id: 'telegram',
      done: hasTelegramConnected,
      label: hasTelegramConnected
        ? 'إشعارات بوت تيليجرام مفعّلة'
        : 'ربط بوت تيليجرام لتنبيهات الطلبات',
      targetTab: 'telegram',
    },
    {
      id: 'mapLocation',
      done: hasMapLocation,
      label: hasMapLocation
        ? 'تم تحديد الموقع على الخريطة'
        : 'إضافة رابط الموقع على الخريطة',
      targetTab: 'set',
    },
    {
      id: 'bio',
      done: hasRichBio && hasSocialLinks,
      label:
        hasRichBio && hasSocialLinks
          ? 'النبذة والروابط مكتملة'
          : 'إكمال النبذة وروابط التواصل',
      targetTab: 'set',
    },
  ];

  if (resolvedPlan.perms.customSlug) {
    dynamicTips.push({
      id: 'slug',
      done: hasCustomSlugConfigured,
      label: hasCustomSlugConfigured
        ? 'الرابط الفرعي المخصص مفعّل'
        : 'حجز الرابط الفرعي المخصص',
      targetTab: 'set',
    });
  }

  const orderedTips: MenuTip[] = [
    ...dynamicTips.filter((tip) => !tip.done),
    ...dynamicTips.filter((tip) => tip.done),
  ];

  const completedTipsCount = dynamicTips.filter((x) => x.done).length;
  const readinessPercent = Math.round((completedTipsCount / dynamicTips.length) * 100);
  const allTipsCompleted = completedTipsCount >= dynamicTips.length;

  const nowMs = Date.now();
  const windowMs = 30 * 24 * 60 * 60 * 1000;
  const validOrders = allOrders.filter(
    (o) => o.st !== 'cancelled' && o.status !== 'cancelled'
  );
  const netSalesAmount = validOrders.reduce(
    (sum, o) => sum + (Number(o.tot ?? o.total ?? 0) || 0),
    0
  );

  const currentOrders = validOrders.filter((o) => {
    const raw = o.at ?? o.createdAt;
    const ms = typeof raw === 'number' ? raw : raw ? new Date(raw).getTime() : 0;
    return ms > 0 && nowMs - ms <= windowMs;
  });
  const prevOrders = validOrders.filter((o) => {
    const raw = o.at ?? o.createdAt;
    const ms = typeof raw === 'number' ? raw : raw ? new Date(raw).getTime() : 0;
    return ms > 0 && nowMs - ms > windowMs && nowMs - ms <= windowMs * 2;
  });

  const currentSales = currentOrders.reduce(
    (sum, o) => sum + (Number(o.tot ?? o.total ?? 0) || 0),
    0
  );
  const prevSales = prevOrders.reduce(
    (sum, o) => sum + (Number(o.tot ?? o.total ?? 0) || 0),
    0
  );

  const calcChangePct = (curr: number, prev: number) => {
    if (prev > 0) return ((curr - prev) / prev) * 100;
    if (curr > 0) return 100;
    return 0;
  };

  const visitsCount = Math.max(0, Number(rest.v || 0));
  const prevVisitsCount = Math.max(0, Number((rest as { vPrev?: number }).vPrev || 0));
  const visitsPct = calcChangePct(visitsCount, prevVisitsCount);
  const ordersPct = calcChangePct(currentOrders.length, prevOrders.length);
  const salesPct = calcChangePct(currentSales, prevSales);

  const homeStats = [
    {
      id: 'visits',
      label: 'عدد زيارات القائمة',
      value: formatNumber(visitsCount),
      pct: visitsPct,
      Icon: Users,
    },
    {
      id: 'orders',
      label: 'صافي الطلبات',
      value: formatNumber(validOrders.length),
      pct: ordersPct,
      Icon: ShoppingBag,
    },
    {
      id: 'sales',
      label: 'صافي المبيعات',
      value: `${formatNumber(netSalesAmount)} ${currency}`,
      pct: salesPct,
      Icon: Banknote,
    },
  ];

  const activePlanName = resolvedPlan.plan.n;

  return (
    <div className="mp-home-wrap">
      {/* Floating Welcome Header (transparent to main grid background) */}
      <div className="mp-home-welcome">
        <img
          src={rest.logo}
          alt={rest.n}
          referrerPolicy="no-referrer"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            objectFit: 'cover',
            border: '2px solid var(--brand)',
            flexShrink: 0,
          }}
        />
        <div style={{ minWidth: 0 }}>
          {activeRid !== mainRid && (
            <div style={{ fontSize: '12px', color: 'var(--brand-ink, #34D399)', fontWeight: 800, marginBottom: '2px' }}>
              {`إدارة فرع: ${rest.branchName || rest.n}`}
            </div>
          )}
          <h1 style={{ margin: '0 0 4px', fontSize: 'clamp(19px, 3vw, 24px)', fontWeight: 900, color: 'var(--ink)' }}>
            {`أهلاً بك في ${rest.n} 👋`}
          </h1>
          <div className="mp-home-welcome-meta">
            <span>
              الباقة النشطة: <b style={{ color: 'var(--brand-ink, #34D399)' }}>{activePlanName}</b>
            </span>
          </div>
        </div>
      </div>

      {/* 3 Organized Transparent KPI Rows */}
      <section className="mp-home-stats-section" aria-label="ملخص الأداء">
        <div className="mp-home-stats-list">
          {homeStats.map((stat, idx) => {
            const IconComp = stat.Icon;
            const isDown = stat.pct < 0;
            const TrendIcon = isDown ? TrendingDown : TrendingUp;
            const trendColor = isDown ? '#ef4444' : '#10b981';
            const formattedPct = `${Math.abs(stat.pct).toFixed(2)}%`;

            return (
              <motion.div
                key={stat.id}
                className="mp-home-stat-row"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.85,
                  delay: prefersReducedMotion ? 0 : 0.05 + idx * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="mp-home-stat-main">
                  <span className="mp-home-stat-icon" aria-hidden="true">
                    <IconComp size={20} strokeWidth={1.85} />
                  </span>
                  <div className="mp-home-stat-text">
                    <div className="mp-home-stat-value tabular-nums">{stat.value}</div>
                    <div className="mp-home-stat-label">{stat.label}</div>
                  </div>
                </div>

                <div className="mp-home-stat-trend tabular-nums" style={{ color: trendColor }}>
                  <span>{formattedPct}</span>
                  <TrendIcon size={15} strokeWidth={2.2} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Checklist Section: transparent & borderless */}
      <section className="mp-home-section">
        <div className="mp-home-section-head">
          <span
            className="mp-home-section-badge"
            style={{
              background: allTipsCompleted ? 'rgba(16, 185, 129, 0.14)' : 'rgba(245, 158, 11, 0.14)',
              color: allTipsCompleted ? '#10b981' : '#f59e0b',
            }}
          >
            {allTipsCompleted ? <CheckCircle2 size={15} /> : <Lightbulb size={15} />}
            <span>{`نسبة الاكتمال: ${readinessPercent}%`}</span>
          </span>

          <h2 className="mp-home-section-title">
            <Ml7Text
              text="خطوات استكمال جاهزية المنيو 💡"
              mode="mount"
              delay={0.08}
              stagger={0.12}
              isRtl
            />
          </h2>

          <motion.p
            className="mp-home-section-sub"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {allTipsCompleted
              ? 'جميع خطوات جاهزية المنيو مكتملة وجاهزة لاستقبال طلبات الزبائن.'
              : 'أكمل الخطوات التالية ليكون منيوك جاهزاً لاستقبال الطلبات بأفضل شكل:'}
          </motion.p>
        </div>

        <div className="mp-home-tips-box" dir="rtl">
          <div className="mp-home-tips-list">
            {orderedTips.map((tip, idx) => (
              <motion.button
                key={tip.id}
                type="button"
                onClick={() => setActiveTab(tip.targetTab)}
                className={`btn s mp-home-tip-btn ${tip.done ? 'is-done' : ''}`}
                dir="rtl"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.75,
                  delay: prefersReducedMotion ? 0 : Math.min(idx * 0.06, 0.35),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span className="mp-home-tip-icon" aria-hidden="true">
                  {tip.done ? (
                    <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                  ) : (
                    <Sparkles size={18} style={{ color: '#f59e0b' }} />
                  )}
                </span>

                <span className="mp-home-tip-label">{tip.label}</span>

                {!tip.done && (
                  <ArrowUpRight size={15} className="mp-home-tip-arrow" aria-hidden="true" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
