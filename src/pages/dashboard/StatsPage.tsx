/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Award,
  BarChart3,
  Calendar,
  Copy,
  ExternalLink,
  Flame,
  Lightbulb,
  Lock,
  TrendingUp,
} from 'lucide-react';
import { Order } from '../../types';
import { formatNumber } from '../../utils/storage';
import { surfaceCardStyle, themedInputStyle, useDashboard } from './DashboardContext';

type StatsPeriod = 'day' | 'week' | 'month' | 'all';

function getOrderDateObj(o: Order): Date | null {
  const raw = o.at ?? o.createdAt;
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const StatsPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const {
    rest,
    resolvedPlan,
    terms,
    currency,
    allOrders,
    liveMenuUrl,
    fullSubdomainUrl,
    publicPath,
    customTabLabel,
    copyLink,
    onNavigate,
    openUpgradeModal,
  } = useDashboard();

  const now = new Date();
  const [period, setPeriod] = useState<StatsPeriod>('month');
  const [selectedDate, setSelectedDate] = useState<string>(() => toYmd(now));
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${m}`;
  });
  const [selectedYear, setSelectedYear] = useState<number>(() => now.getFullYear());

  const availableYears = useMemo(() => {
    const years = new Set<number>([now.getFullYear()]);
    allOrders.forEach((o) => {
      const d = getOrderDateObj(o);
      if (d) years.add(d.getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [allOrders, now]);

  const filteredOrders = useMemo(() => {
    if (period === 'all') {
      return allOrders.filter((o) => {
        const d = getOrderDateObj(o);
        return !d || d.getFullYear() === selectedYear;
      });
    }

    if (period === 'month') {
      const [yStr, mStr] = selectedMonth.split('-');
      const targetY = Number(yStr) || now.getFullYear();
      const targetM = (Number(mStr) || 1) - 1;
      return allOrders.filter((o) => {
        const d = getOrderDateObj(o);
        return d && d.getFullYear() === targetY && d.getMonth() === targetM;
      });
    }

    const baseDate = selectedDate ? new Date(`${selectedDate}T23:59:59`) : new Date();
    const validBase = Number.isNaN(baseDate.getTime()) ? new Date() : baseDate;

    if (period === 'day') {
      const targetYmd = toYmd(validBase);
      return allOrders.filter((o) => {
        const d = getOrderDateObj(o);
        return d && toYmd(d) === targetYmd;
      });
    }

    const endMs = validBase.getTime();
    const startMs = endMs - 7 * 24 * 60 * 60 * 1000;
    return allOrders.filter((o) => {
      const d = getOrderDateObj(o);
      if (!d) return false;
      const ms = d.getTime();
      return ms >= startMs && ms <= endMs;
    });
  }, [allOrders, period, selectedDate, selectedMonth, selectedYear, now]);

  const validOrders = filteredOrders.filter((o) => o.st !== 'cancelled' && o.status !== 'cancelled');
  const totalSales = validOrders.reduce((sum, o) => sum + (Number(o.tot ?? o.total ?? 0) || 0), 0);
  const completedOrders = filteredOrders.filter((o) => o.st === 'completed' || o.status === 'completed').length;
  const cancelledOrders = filteredOrders.filter((o) => o.st === 'cancelled' || o.status === 'cancelled').length;
  const deliveryOrdersCount = validOrders.filter((o) => (o.type || o.cu?.orderType || 'delivery') === 'delivery').length;
  const pickupOrdersCount = validOrders.filter((o) => (o.type || o.cu?.orderType) === 'pickup').length;
  const tableOrdersCount = validOrders.filter((o) => (o.type || o.cu?.orderType) === 'table').length;
  const avgOrder = validOrders.length > 0 ? Math.round(totalSales / validOrders.length) : 0;
  const completionRate = filteredOrders.length > 0 ? Math.round((completedOrders / filteredOrders.length) * 100) : 0;

  // Top-Ordered Items Leaderboard
  const topOrderedItems = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; ordersCount: number; revenue: number }>();
    validOrders.forEach((order) => {
      const seenInOrder = new Set<string>();
      (order.items || []).forEach((it) => {
        const name = String(it.n || it.name || '').trim();
        if (!name) return;
        const qty = Math.max(1, Number(it.q ?? it.qty ?? 1) || 1);
        const unitPrice = Number(it.p ?? it.price ?? 0) || 0;
        const entry = map.get(name) || { name, qty: 0, ordersCount: 0, revenue: 0 };
        entry.qty += qty;
        entry.revenue += unitPrice * qty;
        if (!seenInOrder.has(name)) {
          entry.ordersCount += 1;
          seenInOrder.add(name);
        }
        map.set(name, entry);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty).slice(0, 8);
  }, [validOrders]);

  const maxItemQty = topOrderedItems[0]?.qty || 1;

  const periodLabel =
    period === 'day'
      ? `يومي (${selectedDate})`
      : period === 'week'
      ? `أسبوعي (7 أيام حتى ${selectedDate})`
      : period === 'month'
      ? `شهري (${selectedMonth})`
      : `سنوي (${selectedYear})`;

  const insights = useMemo(() => {
    const list: string[] = [];
    if (topOrderedItems.length > 0) {
      const top = topOrderedItems[0];
      list.push(
        `أكثر ${terms.itemSingular} طلباً في هذه الفترة هو "${top.name}" بعدد ${top.qty} وحدة وإيرادات ${formatNumber(top.revenue)} ${currency}.`
      );
    } else {
      list.push(
        'لا توجد طلبات مسجلة في هذه الفترة الزمنية بعد — شارك رابط المنيو لبدء رصد الأكثر طلباً.'
      );
    }

    if (validOrders.length > 0) {
      const topChannel =
        deliveryOrdersCount >= pickupOrdersCount && deliveryOrdersCount >= tableOrdersCount
          ? `طلبات التوصيل (${deliveryOrdersCount})`
          : pickupOrdersCount >= tableOrdersCount
          ? `الاستلام من الفرع (${pickupOrdersCount})`
          : `طلبات الطاولات (${tableOrdersCount})`;
      list.push(
        `القناة الأكثر نشاطاً هي ${topChannel} بمتوسط فاتورة ${formatNumber(avgOrder)} ${currency}.`
      );
    }

    if (filteredOrders.length > 0) {
      list.push(
        completionRate >= 80
          ? `معدل إتمام الطلبات ممتاز (${completionRate}%) مع ${cancelledOrders} طلبات ملغاة فقط.`
          : `معدل إتمام الطلبات حالياً ${completionRate}% — تأكد من متابعة تبويب "الطلبات" أولاً بأول.`
      );
    }
    return list;
  }, [
    topOrderedItems,
    validOrders.length,
    deliveryOrdersCount,
    pickupOrdersCount,
    tableOrdersCount,
    avgOrder,
    currency,
    filteredOrders.length,
    completionRate,
    cancelledOrders,
    terms.itemSingular,
  ]);

  const activePlanName = resolvedPlan.plan.n;

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: '25px', fontWeight: 900, color: 'var(--ink)' }}>
            {customTabLabel('stats', 'احصائيات احترافية')} • {rest.n} 📊
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>
            {`تحليل تفصيلي للطلبات، الإيرادات (${currency})، والأصناف الأكثر طلباً يومياً وأسبوعياً وشهرياً.`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => copyLink(liveMenuUrl)}
            className="btn s"
          >
            <Copy size={14} />
            <span>نسخ رابط المنيو</span>
          </button>
          {fullSubdomainUrl ? (
            <a
              href={fullSubdomainUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn p s"
              style={{ textDecoration: 'none' }}
            >
              <ExternalLink size={14} />
              <span>فتح المنيو</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate(publicPath)}
              className="btn p s"
            >
              <ExternalLink size={14} />
              <span>فتح المنيو</span>
            </button>
          )}
        </div>
      </div>

      {/* Locked State for Free Plan */}
      {!resolvedPlan.perms.analytics ? (
        <div
          style={{
            ...surfaceCardStyle,
            padding: '28px 24px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            border: '1.5px dashed rgba(245, 158, 11, 0.45)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 300px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(245, 158, 11, 0.14)',
                color: '#f59e0b',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <Lock size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 900, color: 'var(--ink)', margin: '0 0 4px' }}>
                {`الإحصائيات الاحترافية مقفلة في ${activePlanName} 🔒`}
              </h2>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.6 }}>
                هذه الميزة متاحة بدءاً من الباقة الاقتصادية والباقات الأعلى لمتابعة المبيعات اليومية والأسبوعية والشهرية والأصناف الأكثر طلباً.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openUpgradeModal('starter')}
            className="btn p s"
            style={{ fontWeight: 800, padding: '10px 18px' }}
          >
            ترقية الباقة الآن
          </button>
        </div>
      ) : (
        <>
          {/* Period Filter Bar */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{
              ...surfaceCardStyle,
              borderRadius: '18px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', fontWeight: 800, color: 'var(--muted)', marginInlineEnd: '4px' }}>
                <Calendar size={15} style={{ color: 'var(--brand-ink, #34D399)' }} />
                الفترة:
              </span>
              {[
                { id: 'day' as const, label: 'يومي' },
                { id: 'week' as const, label: 'أسبوعي' },
                { id: 'month' as const, label: 'شهري' },
                { id: 'all' as const, label: 'سنوي / الكل' },
              ].map((opt) => {
                const active = period === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPeriod(opt.id)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '10px',
                      border: active ? '1.5px solid var(--brand)' : '1px solid var(--line)',
                      background: active ? 'var(--brand)' : 'color-mix(in srgb, var(--surface) 40%, transparent)',
                      color: active ? 'var(--on-brand)' : 'var(--ink)',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {(period === 'day' || period === 'week') && (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ ...themedInputStyle, width: 'auto', minHeight: '38px', padding: '6px 10px', fontSize: '13px' }}
                />
              )}
              {period === 'month' && (
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{ ...themedInputStyle, width: 'auto', minHeight: '38px', padding: '6px 10px', fontSize: '13px' }}
                />
              )}
              {period === 'all' && (
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  style={{ ...themedInputStyle, width: 'auto', minHeight: '38px', padding: '6px 32px 6px 12px', fontSize: '13px' }}
                >
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {`سنة ${y}`}
                    </option>
                  ))}
                </select>
              )}
              <span style={{ fontSize: '12px', color: 'var(--brand-ink, #34D399)', fontWeight: 800 }}>
                {periodLabel}
              </span>
            </div>
          </motion.div>

          {/* Detailed KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.82, delay: prefersReducedMotion ? 0 : 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              style={{ ...surfaceCardStyle, padding: '18px 20px', borderRadius: '16px' }}
            >
              <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 700 }}>
                إجمالي الإيرادات
              </div>
              <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 900, color: '#10b981' }}>
                {formatNumber(totalSales)} <span style={{ fontSize: '14px' }}>{currency}</span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '4px' }}>
                {`من ${validOrders.length} طلب فعّال`}
              </div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.82, delay: prefersReducedMotion ? 0 : 0.14, ease: [0.16, 1, 0.3, 1] }}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              style={{ ...surfaceCardStyle, padding: '18px 20px', borderRadius: '16px' }}
            >
              <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 700 }}>
                الطلبات المسجلة
              </div>
              <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 900, color: 'var(--brand-ink, #34D399)' }}>
                {filteredOrders.length}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '4px' }}>
                {`مكتمل: ${completedOrders} (${completionRate}%) • ملغى: ${cancelledOrders}`}
              </div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.82, delay: prefersReducedMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              style={{ ...surfaceCardStyle, padding: '18px 20px', borderRadius: '16px' }}
            >
              <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 700 }}>
                متوسط قيمة الطلب
              </div>
              <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 900, color: 'var(--ink)' }}>
                {formatNumber(avgOrder)} <span style={{ fontSize: '14px' }}>{currency}</span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '4px' }}>
                معدل السلة للطلب الواحد
              </div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.82, delay: prefersReducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              style={{ ...surfaceCardStyle, padding: '18px 20px', borderRadius: '16px' }}
            >
              <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 700 }}>
                توزيع القنوات
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
                <span>🛵 توصيل: {deliveryOrdersCount}</span>
                <span>🏪 استلام: {pickupOrdersCount}</span>
                {resolvedPlan.perms.tableOrders && <span>🍽️ طاولات: {tableOrdersCount}</span>}
              </div>
            </motion.div>
          </div>

          {/* Top Ordered Items + Performance Insights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {/* Top Ordered Items */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ ...surfaceCardStyle, padding: '22px', borderRadius: '20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'rgba(245, 158, 11, 0.14)', color: '#f59e0b', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Flame size={19} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '16.5px', fontWeight: 900, color: 'var(--ink)' }}>
                    {`${terms.itemsPlural} الأكثر طلباً (${periodLabel})`}
                  </h2>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
                    ترتيب تلقائي حسب الكمية المباعة وإجمالي المبيعات
                  </p>
                </div>
              </div>

              {topOrderedItems.length === 0 ? (
                <div
                  style={{
                    background: 'color-mix(in srgb, var(--surface) 40%, transparent)',
                    backdropFilter: 'blur(14px) saturate(1.25)',
                    WebkitBackdropFilter: 'blur(14px) saturate(1.25)',
                    border: '1px dashed var(--line)',
                    borderRadius: '14px',
                    padding: '24px 16px',
                    textAlign: 'center',
                    color: 'var(--muted)',
                    fontSize: '13px',
                  }}
                >
                  <BarChart3 size={24} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
                  <div>لا توجد طلبات مسجلة ضمن الفترة المحددة.</div>
                </div>
              ) : (
                <div style={{ borderTop: '1px solid var(--line)' }}>
                  {topOrderedItems.map((item, idx) => {
                    const pct = Math.max(8, Math.round((item.qty / maxItemQty) * 100));
                    return (
                      <div
                        key={item.name}
                        style={{
                          borderBottom: '1px solid var(--line)',
                          padding: '10px 2px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                            <span
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '7px',
                                background: idx === 0 ? 'rgba(245, 158, 11, 0.2)' : 'var(--soft)',
                                color: idx === 0 ? '#f59e0b' : 'var(--brand-ink, #34D399)',
                                fontSize: '11.5px',
                                fontWeight: 900,
                                display: 'grid',
                                placeItems: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {idx === 0 ? <Award size={14} /> : idx + 1}
                            </span>
                            <b style={{ fontSize: '13.5px', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.name}
                            </b>
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: '#10b981', whiteSpace: 'nowrap' }}>
                            {item.qty} طلب • {formatNumber(item.revenue)} {currency}
                          </div>
                        </div>
                        <div style={{ height: '6px', borderRadius: '99px', background: 'rgba(148,163,184,0.14)', overflow: 'hidden' }}>
                          <motion.div
                            initial={prefersReducedMotion ? false : { width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ duration: 0.9, delay: prefersReducedMotion ? 0 : idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              borderRadius: '99px',
                              background: idx === 0 ? '#f59e0b' : 'var(--brand)',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Automated Summary & Insights */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ duration: 0.9, delay: prefersReducedMotion ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{ ...surfaceCardStyle, padding: '22px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'var(--soft)', color: 'var(--brand-ink, #34D399)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <TrendingUp size={19} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '16.5px', fontWeight: 900, color: 'var(--ink)' }}>
                    ملخص الأداء والتوصيات
                  </h2>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
                    {`قراءة ذكية لنتائج مشروعك في ${periodLabel}`}
                  </p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--line)' }}>
                {insights.map((text, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderBottom: '1px solid var(--line)',
                      padding: '12px 2px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontSize: '13px',
                      color: 'var(--ink)',
                      lineHeight: 1.6,
                    }}
                  >
                    <Lightbulb size={17} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};
