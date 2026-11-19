/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  CheckCircle2,
  Coins,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Link2,
  Lock,
  MapPin,
  MessageCircle,
  Monitor,
  Moon,
  Plus,
  Send,
  Share2,
  ShieldCheck,
  Store,
  Sun,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react';
import { MediaLibraryModal } from '../../components/MediaLibraryModal';
import { sanitizeSlug } from '../../utils/businessDefaults';
import {
  WEEK_DAYS_ORDER,
  surfaceCardStyle,
  themedInputStyle,
  useDashboard,
} from './DashboardContext';

export const SettingsPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'logo' | 'cover' | null>(null);
  const {
    showToast,
    resolvedPlan,
    openUpgradeModal,
    menuThemeMode,
    handleSelectThemeMode,
    dashboardThemeMode,
    handleSelectDashboardThemeMode,
    customTabLabel,
    baseDomain,
    fullSubdomainUrl,
    subdomainEnabled,
    publicPath,
    liveMenuUrl,
    onNavigate,
    copyLink,
    openShareModal,
    restSlug,
    setRestSlug,
    slugCheckState,
    checkSubdomainAvailability,
    coverUrlInput,
    setCoverUrlInput,
    logoUrlInput,
    setLogoUrlInput,
    aboutTextInput,
    setAboutTextInput,
    taxNoteInput,
    setTaxNoteInput,
    showLogoUrlField,
    setShowLogoUrlField,
    showBannerUrlField,
    setShowBannerUrlField,
    handleCurrencyChange,
    flushAllPendingSaves,
    mediaLibraryItems,
    uploadImagesToLibrary,
    removeMediaLibraryItem,
    restProjectType,
    setRestProjectType,
    restName,
    setRestName,
    restTagline,
    setRestTagline,
    restCurrency,
    restActive,
    setRestActive,
    allowDelivery,
    setAllowDelivery,
    allowPickup,
    setAllowPickup,
    allowTable,
    setAllowTable,
    rest,
    setActiveTab,
    acceptClosedOrders,
    setAcceptClosedOrders,
    orderChannel,
    setOrderChannel,
    restPhone,
    setRestPhone,
    restWa,
    setRestWa,
    restAddress,
    setRestAddress,
    restInstagram,
    setRestInstagram,
    restMapUrl,
    setRestMapUrl,
    restGoogleReviewUrl,
    setRestGoogleReviewUrl,
    restFacebook,
    setRestFacebook,
    restTiktok,
    setRestTiktok,
    workMode,
    setWorkMode,
    workFrom,
    setWorkFrom,
    workTo,
    setWorkTo,
    weeklyHours,
    setWeeklyHours,
    applyTimeToOpenDays,
    deliveryZonesState,
    setDeliveryZonesState,
  } = useDashboard();

  const weekDaysOrder = WEEK_DAYS_ORDER;

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const previewSubdomainHost = subdomainEnabled
    ? `${restSlug || 'your-store'}.${baseDomain}`
    : `${baseDomain}/${restSlug || 'your-store'}`;

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto' }}>
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}
      >
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '23px', fontWeight: 900, color: 'var(--ink)' }}>
            {customTabLabel('set', 'إعدادات المشروع والرابط المخصص ⚙️')}
          </h1>
          <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--muted)' }}>
            تحكم بالعملة، الدومين الفرعي، الشعار والغلاف، الدوام الأسبوعي، وأسعار التوصيل — يتم الحفظ تلقائياً.
          </p>
        </div>
      </motion.div>

      {/* Continuous Section Quick Jump Strip */}
      <motion.div
        className="mp-jump-strip"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: prefersReducedMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        {[
          { id: 'sec-lang', label: '1. العملة والتشغيل والطلبات' },
          { id: 'sec-slug', label: '2. الرابط والدومين' },
          { id: 'sec-media', label: '3. الشعار والغلاف' },
          { id: 'sec-identity', label: '4. الهوية والتواصل' },
          { id: 'sec-delivery', label: '5. الدوام والتوصيل' },
        ].map((sec) => (
          <button
            key={sec.id}
            type="button"
            className="mp-jump-btn"
            onClick={() => jumpTo(sec.id)}
          >
            {sec.label}
          </button>
        ))}
      </motion.div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void flushAllPendingSaves();
        }}
        className="mp-settings-sections"
      >
        {/* SECTION 1: العملة وحالة التشغيل وطرق الطلب */}
        <motion.section
          id="sec-lang"
          className="mp-set-sec"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.06 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mp-set-sec-head">
            <h2 className="mp-set-sec-title">
              <span className="mp-set-sec-num">1</span>
              <span>العملة وحالة المنيو وطرق الطلب</span>
            </h2>
          </div>

          <div className="mp-set-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'var(--soft)',
                    color: 'var(--brand-ink, #34D399)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Coins size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)', margin: '0 0 2px' }}>
                    اختيار العملة
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0 }}>
                    تُعرض بها أسعار الأطباق والفواتير في المنيو ولوحة التحكم.
                  </p>
                </div>
              </div>

              <select
                value={restCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                style={{
                  ...themedInputStyle,
                  width: 'auto',
                  minWidth: '210px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <option value="د.ع">د.ع — دينار عراقي (IQD)</option>
                <option value="$">$ — دولار أمريكي (USD)</option>
                <option value="ر.س">ر.س — ريال سعودي (SAR)</option>
                <option value="د.إ">د.إ — درهم إماراتي (AED)</option>
                <option value="د.ك">د.ك — دينار كويتي (KWD)</option>
                <option value="د.أ">د.أ — دينار أردني (JOD)</option>
                <option value="ر.ق">ر.ق — ريال قطري (QAR)</option>
                <option value="د.ب">د.ب — دينار بحريني (BHD)</option>
                <option value="ر.ع">ر.ع — ريال عماني (OMR)</option>
                <option value="ج.م">ج.م — جنيه مصري (EGP)</option>
                <option value="ل.ل">ل.ل — ليرة لبنانية (LBP)</option>
                <option value="€">€ — يورو (EUR)</option>
              </select>
            </div>

            <div style={{ height: '1px', background: 'var(--line)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'var(--soft)',
                    color: 'var(--brand-ink, #34D399)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  {menuThemeMode === 'light' ? (
                    <Sun size={20} />
                  ) : menuThemeMode === 'auto' ? (
                    <Monitor size={20} />
                  ) : (
                    <Moon size={20} />
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)', margin: '0 0 2px' }}>
                    مظهر المنيو
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0 }}>
                    فاتح أو غامق أو حسب جهاز الزبون
                  </p>
                </div>
              </div>

              <div className="mp-theme-icon-switch" role="group" aria-label="مظهر المنيو">
                <button
                  type="button"
                  onClick={() => handleSelectThemeMode('light')}
                  className={`mp-theme-icon-btn${menuThemeMode === 'light' ? ' is-active' : ''}`}
                  aria-label="الوضع الفاتح"
                  title="فاتح"
                >
                  <Sun size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectThemeMode('dark')}
                  className={`mp-theme-icon-btn${menuThemeMode === 'dark' ? ' is-active' : ''}`}
                  aria-label="الوضع الغامق"
                  title="غامق"
                >
                  <Moon size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectThemeMode('auto')}
                  className={`mp-theme-icon-btn${menuThemeMode === 'auto' ? ' is-active' : ''}`}
                  aria-label="حسب جهاز الزبون تلقائياً"
                  title="حسب جهاز الزبون"
                >
                  <Monitor size={17} />
                </button>
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--line)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'var(--soft)',
                    color: 'var(--brand-ink, #34D399)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  {dashboardThemeMode === 'light' ? (
                    <Sun size={20} />
                  ) : dashboardThemeMode === 'auto' ? (
                    <Monitor size={20} />
                  ) : (
                    <Moon size={20} />
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)', margin: '0 0 2px' }}>
                    مظهر لوحة التحكم
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0 }}>
                    فاتح أو داكن أو حسب جهازك
                  </p>
                </div>
              </div>

              <div className="mp-theme-icon-switch" role="group" aria-label="مظهر لوحة التحكم">
                <button
                  type="button"
                  onClick={() => void handleSelectDashboardThemeMode('light')}
                  className={`mp-theme-icon-btn${dashboardThemeMode === 'light' ? ' is-active' : ''}`}
                  aria-label="الوضع الفاتح"
                  title="فاتح"
                >
                  <Sun size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => void handleSelectDashboardThemeMode('dark')}
                  className={`mp-theme-icon-btn${dashboardThemeMode === 'dark' ? ' is-active' : ''}`}
                  aria-label="الوضع الداكن"
                  title="داكن"
                >
                  <Moon size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => void handleSelectDashboardThemeMode('auto')}
                  className={`mp-theme-icon-btn${dashboardThemeMode === 'auto' ? ' is-active' : ''}`}
                  aria-label="حسب جهازك تلقائياً"
                  title="حسب جهازك"
                >
                  <Monitor size={17} />
                </button>
              </div>
            </div>
            <div className="mp-section-divider" />

            <div>
              <h3 style={{ fontSize: '15.5px', fontWeight: 900, color: 'var(--ink)', margin: '0 0 10px' }}>
                التحكم بحالة المنيو وطرق الطلب
              </h3>

              <div style={{ borderTop: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '12px 2px', borderBottom: '1px solid var(--line)' }}>
                  <div>
                    <b style={{ fontSize: '14px', color: 'var(--ink)', display: 'block' }}>حالة المنيو للزبائن</b>
                    <span style={{ fontSize: '12px', color: restActive ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                      {restActive
                        ? 'مفعّل — يظهر المنيو ويستقبل الزبائن'
                        : 'متوقف مؤقتاً — يظهر تنبيه إيقاف مؤقت للزوار'}
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={restActive}
                    onClick={() => setRestActive((v) => !v)}
                    style={{
                      width: '50px',
                      height: '28px',
                      borderRadius: '999px',
                      border: 0,
                      padding: '3px',
                      cursor: 'pointer',
                      background: restActive ? '#10b981' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: restActive ? 'flex-start' : 'flex-end',
                      transition: 'background 0.2s ease',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px', padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 4px', cursor: resolvedPlan.perms.deliveryOrders ? 'pointer' : 'not-allowed', opacity: resolvedPlan.perms.deliveryOrders ? 1 : 0.6, fontWeight: 700, fontSize: '13px' }}>
                    <span>🚚 طلبات التوصيل {!resolvedPlan.perms.deliveryOrders && '🔒'}</span>
                    <input
                      type="checkbox"
                      disabled={!resolvedPlan.perms.deliveryOrders}
                      checked={resolvedPlan.perms.deliveryOrders && allowDelivery}
                      onChange={(e) => setAllowDelivery(e.target.checked)}
                    />
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 4px', cursor: resolvedPlan.perms.pickupOrders ? 'pointer' : 'not-allowed', opacity: resolvedPlan.perms.pickupOrders ? 1 : 0.6, fontWeight: 700, fontSize: '13px' }}>
                    <span>🏪 الحجز / الاستلام {!resolvedPlan.perms.pickupOrders && '🔒'}</span>
                    <input
                      type="checkbox"
                      disabled={!resolvedPlan.perms.pickupOrders}
                      checked={resolvedPlan.perms.pickupOrders && allowPickup}
                      onChange={(e) => setAllowPickup(e.target.checked)}
                    />
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 4px', cursor: resolvedPlan.perms.tableOrders ? 'pointer' : 'not-allowed', opacity: resolvedPlan.perms.tableOrders ? 1 : 0.6, fontWeight: 700, fontSize: '13px' }}>
                    <span>
                      🍽️ طلبات الطاولات
                      {!resolvedPlan.perms.tableOrders && (
                        <span style={{ display: 'block', fontSize: '11px', color: '#f59e0b', marginTop: '2px' }}>
                          🔒 متاح في الباقة الاحترافية فأعلى
                        </span>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      disabled={!resolvedPlan.perms.tableOrders}
                      checked={resolvedPlan.perms.tableOrders && allowTable}
                      onChange={(e) => setAllowTable(e.target.checked)}
                    />
                  </label>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 2px 4px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
                  <span>🌙 استقبال الطلبات المسبقة حتى عند إغلاق المطعم خارج ساعات الدوام</span>
                  <input
                    type="checkbox"
                    checked={acceptClosedOrders}
                    onChange={(e) => setAcceptClosedOrders(e.target.checked)}
                  />
                </label>
              </div>
            </div>

            <div className="mp-section-divider" />

            <div>
              <h3 style={{ fontSize: '15.5px', fontWeight: 900, color: 'var(--ink)', margin: '0 0 4px' }}>
                قناة إرسال واستقبال الطلبات (تيليجرام / واتساب)
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: '0 0 12px', lineHeight: 1.6 }}>
                اختر كيف تصل طلبات الزبائن من المنيو: عبر التليجرام والواتساب معاً، أو عبر التليجرام فقط دون فتح واتساب، أو عبر الواتساب فقط.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {[
                  {
                    id: 'both' as const,
                    title: 'تفعيل الاثنين معاً',
                    desc: 'إشعار فوري على تيليجرام + تحويل الزبون لتأكيد الطلب عبر واتساب',
                    accent: '#10b981',
                    Icon: CheckCircle2,
                  },
                  {
                    id: 'telegram' as const,
                    title: 'عبر التليجرام فقط',
                    desc: 'إرسال الطلب مباشرة للوحة التحكم وبوت تيليجرام بدون تحويل لواتساب',
                    accent: '#0088cc',
                    Icon: Send,
                  },
                  {
                    id: 'whatsapp' as const,
                    title: 'عبر الواتساب فقط',
                    desc: 'إرسال الطلب عبر محادثة واتساب فقط مع إيقاف إشعارات تيليجرام',
                    accent: '#16a34a',
                    Icon: MessageCircle,
                  },
                ].map((opt) => {
                  const selected = orderChannel === opt.id;
                  const OptIcon = opt.Icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setOrderChannel(opt.id)}
                      style={{
                        textAlign: 'start',
                        borderRadius: '14px',
                        padding: '13px 14px',
                        cursor: 'pointer',
                        border: selected
                          ? `2px solid ${opt.accent}`
                          : '1px solid var(--line)',
                        background: selected
                          ? `color-mix(in srgb, ${opt.accent} 10%, var(--surface))`
                          : 'var(--bg)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        transition: 'all 0.15s ease',
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: selected ? opt.accent : 'var(--soft)',
                          color: selected ? '#ffffff' : 'var(--muted)',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        <OptIcon size={18} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)', marginBottom: '3px' }}>
                          {opt.title}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                          {opt.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {orderChannel !== 'whatsapp' && !rest.telegramChatId && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--ink)', fontWeight: 700 }}>
                    <AlertCircle size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
                    <span>لم يتم ربط حساب التليجرام لهذا المتجر بعد — يجب مشاركة رقمك مع البوت لتصل الطلبات.</span>
                  </div>
                  <button
                    type="button"
                    className="btn s"
                    onClick={() => setActiveTab('telegram')}
                    style={{ fontWeight: 800, fontSize: '12px' }}
                  >
                    <Send size={13} />
                    <span>الذهاب إلى إعداد التليجرام</span>
                  </button>
                </div>
              )}

              {orderChannel !== 'telegram' && !restWa.trim() && !restPhone.trim() && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px',
                    fontSize: '12.5px',
                    color: '#ef4444',
                    fontWeight: 700,
                  }}
                >
                  <span>يرجى إدخال رقم الواتساب في القسم الرابع أدناه لاستقبال طلبات الواتساب.</span>
                  <button
                    type="button"
                    className="btn s"
                    onClick={() => jumpTo('sec-identity')}
                    style={{ fontSize: '12px' }}
                  >
                    إدخال الرقم الآن
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* SECTION 2: رابط المنيو المخصص باسم حسابك */}
        <motion.section
          id="sec-slug"
          className="mp-set-sec"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.06 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mp-set-sec-head">
            <h2 className="mp-set-sec-title">
              <span className="mp-set-sec-num">2</span>
              <span>
                {subdomainEnabled
                  ? 'الرابط المخصص والدومين الفرعي باسم مشروعك'
                  : 'رابط المنيو المخصص باسم حسابك'}
              </span>
            </h2>
          </div>

          <div className="mp-set-card" style={{ gap: '12px' }}>
            {!resolvedPlan.perms.customSlug ? (
              <>
                <div
                  style={{
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                      رابط منيو مشروعك الحالي (كود تلقائي من 6 خانات):
                    </div>
                    <b dir="ltr" style={{ fontSize: '13.5px', color: 'var(--brand-ink, #34D399)', wordBreak: 'break-all' }}>
                      {liveMenuUrl}
                    </b>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button type="button" className="btn s" onClick={openShareModal}>
                      <Share2 size={13} />
                      <span>مشاركة المنيو</span>
                    </button>
                    <button type="button" className="btn s" onClick={() => copyLink(liveMenuUrl)}>
                      <Copy size={13} />
                      <span>نسخ الرابط</span>
                    </button>
                    <button type="button" className="btn s" onClick={() => onNavigate(publicPath)}>
                      <ExternalLink size={13} />
                      <span>معاينة المنيو</span>
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: 0,
                    borderRadius: '14px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 240px' }}>
                    <Lock size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
                    <div>
                      <b style={{ fontSize: '13.5px', color: 'var(--ink)', display: 'block' }}>
                        اختيار اسم حساب مخصص للرابط (<span dir="ltr">{baseDomain}/user</span>) متاح للباقات المدفوعة فقط
                      </b>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                        قم بتفعيل أو ترقية باقتك إلى{' '}
                        <b>الباقة الاقتصادية</b>{' '}
                        أو أعلى لتخصيص رابط مباشر باسم مشروعك.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openUpgradeModal('starter')}
                    className="btn p s"
                    style={{ fontWeight: 800 }}
                  >
                    ترقية الباقة الآن
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
                  اختر اسم حساب إنجليزياً فريداً غير مكرر لمشروعك ليُحفظ ويُفعّل فوراً{' '}
                  (<code dir="ltr">{baseDomain}/user</code>):
                </p>

                <div style={{ display: 'flex', alignItems: 'stretch', gap: '8px', flexWrap: 'wrap' }}>
                  <div
                    dir="ltr"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flex: '1 1 240px',
                      background: 'color-mix(in srgb, var(--surface) 40%, transparent)',
                      backdropFilter: 'blur(12px) saturate(1.2)',
                      WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
                      border: '1.5px solid rgba(52, 211, 153, 0.34)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    {!subdomainEnabled && (
                      <span
                        style={{
                          padding: '0 12px',
                          fontSize: '12.5px',
                          fontWeight: 800,
                          color: 'var(--brand-ink, #34D399)',
                          borderInlineEnd: '1px solid var(--line)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        https://{baseDomain}/
                      </span>
                    )}
                    <input
                      type="text"
                      dir="ltr"
                      value={restSlug}
                      onChange={(e) => setRestSlug(sanitizeSlug(e.target.value))}
                      placeholder="your-restaurant"
                      style={{
                        border: 0,
                        background: 'transparent',
                        outline: 'none',
                        padding: '10px 12px',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'var(--ink)',
                        flex: 1,
                        minHeight: '42px',
                      }}
                    />
                    {subdomainEnabled && (
                      <span
                        style={{
                          padding: '0 12px',
                          fontSize: '12.5px',
                          fontWeight: 800,
                          color: 'var(--brand-ink, #34D399)',
                          borderInlineStart: '1px solid var(--line)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        .{baseDomain}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn s"
                    disabled={slugCheckState.checking || !restSlug}
                    onClick={() => void checkSubdomainAvailability(restSlug)}
                    style={{ fontWeight: 800, minHeight: '44px' }}
                  >
                    <ShieldCheck size={15} />
                    <span>{slugCheckState.checking ? 'جاري الفحص...' : 'فحص التوفر'}</span>
                  </button>
                </div>

                {slugCheckState.message && (
                  <div
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 800,
                      color: slugCheckState.available ? '#10b981' : '#ef4444',
                    }}
                  >
                    {slugCheckState.message}
                  </div>
                )}

                <div
                  style={{
                    paddingTop: '12px',
                    borderTop: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                      الرابط المباشر الحالي:
                    </div>
                    <b dir="ltr" style={{ fontSize: '13px', color: 'var(--brand-ink, #34D399)', wordBreak: 'break-all' }}>
                      {restSlug ? `https://${previewSubdomainHost}` : liveMenuUrl}
                    </b>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button type="button" className="btn s" onClick={openShareModal}>
                      <Share2 size={13} />
                      <span>مشاركة المنيو</span>
                    </button>
                    <button
                      type="button"
                      className="btn s"
                      onClick={() => copyLink(restSlug ? `https://${previewSubdomainHost}` : liveMenuUrl)}
                    >
                      <Copy size={13} />
                      <span>نسخ</span>
                    </button>
                    {fullSubdomainUrl ? (
                      <a
                        href={fullSubdomainUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn s"
                        style={{ textDecoration: 'none' }}
                      >
                        <ExternalLink size={13} />
                        <span>فتح الدومين</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="btn s"
                        onClick={() => onNavigate(publicPath)}
                      >
                        <ExternalLink size={13} />
                        <span>معاينة المنيو</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.section>

        {/* SECTION 3: شعار المنيو وصورة الغلاف */}
        <motion.section
          id="sec-media"
          className="mp-set-sec"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.06 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mp-set-sec-head">
            <h2 className="mp-set-sec-title">
              <span className="mp-set-sec-num">3</span>
              <span>شعار المشروع وصورة البانر (الغلاف)</span>
            </h2>
          </div>

          <div className="mp-set-card">
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0 }}>
              تظهر صورة الشعار والغلاف مباشرة أعلى المنيو الإلكتروني أمام الزبائن.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              {/* Logo */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--ink)' }}>شعار المشروع (Logo)</span>
                  <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 600 }}>مربع 1:1</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '78px',
                      height: '78px',
                      borderRadius: '50%',
                      border: '2px solid var(--line)',
                      background: 'color-mix(in srgb, var(--surface) 40%, transparent)',
                      overflow: 'hidden',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {logoUrlInput ? (
                      <img src={logoUrlInput} alt="شعار المنيو" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ImageIcon size={24} style={{ color: 'var(--muted)' }} />
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget('logo')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '9px 14px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'var(--brand)',
                        color: 'var(--on-brand)',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        width: 'fit-content',
                      }}
                    >
                      <ImageIcon size={14} />
                      <span>اختيار من مكتبة الصور</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setShowLogoUrlField((v) => !v)}
                        style={{
                          background: 'color-mix(in srgb, var(--surface) 40%, transparent)',
                          border: '1px solid var(--line)',
                          color: 'var(--ink)',
                          borderRadius: '8px',
                          padding: '5px 10px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Link2 size={12} />
                        <span>{showLogoUrlField ? 'إخفاء الرابط' : 'إدخال رابط'}</span>
                      </button>
                      {logoUrlInput && (
                        <button
                          type="button"
                          onClick={() => setLogoUrlInput('')}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: '#ef4444',
                            borderRadius: '8px',
                            padding: '5px 10px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          إزالة
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {showLogoUrlField && (
                  <input
                    type="text"
                    dir="ltr"
                    value={logoUrlInput}
                    onChange={(e) => setLogoUrlInput(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    style={{ ...themedInputStyle, textAlign: 'left', fontSize: '12.5px' }}
                  />
                )}
              </div>

              {/* Banner */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--ink)' }}>صورة الغلاف (Banner)</span>
                  <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 600 }}>عريض 16:9</span>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '94px',
                    borderRadius: '12px',
                    border: 0,
                    background: 'color-mix(in srgb, var(--surface) 40%, transparent)',
                    overflow: 'hidden',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {coverUrlInput ? (
                    <img src={coverUrlInput} alt="بانر المنيو" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--muted)' }}>
                      <ImageIcon size={22} />
                      <span style={{ fontSize: '11.5px' }}>لم يتم اختيار صورة غلاف</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setMediaPickerTarget('cover')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'var(--brand)',
                      color: 'var(--on-brand)',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    <ImageIcon size={14} />
                    <span>اختيار من مكتبة الصور</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBannerUrlField((v) => !v)}
                    style={{
                      background: 'color-mix(in srgb, var(--surface) 40%, transparent)',
                      border: '1px solid var(--line)',
                      color: 'var(--ink)',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Link2 size={12} />
                    <span>{showBannerUrlField ? 'إخفاء الرابط' : 'إدخال رابط'}</span>
                  </button>
                  {coverUrlInput && (
                    <button
                      type="button"
                      onClick={() => setCoverUrlInput('')}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#ef4444',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      إزالة
                    </button>
                  )}
                </div>

                {showBannerUrlField && (
                  <input
                    type="text"
                    dir="ltr"
                    value={coverUrlInput}
                    onChange={(e) => setCoverUrlInput(e.target.value)}
                    placeholder="https://example.com/banner.jpg"
                    style={{ ...themedInputStyle, textAlign: 'left', fontSize: '12.5px' }}
                  />
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION 4: هوية المشروع، نبذة عن المشروع، والتواصل */}
        <motion.section
          id="sec-identity"
          className="mp-set-sec"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.06 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mp-set-sec-head">
            <h2 className="mp-set-sec-title">
              <span className="mp-set-sec-num">4</span>
              <span>هوية المشروع، النبذة، والتواصل</span>
            </h2>
          </div>

          <div className="mp-set-card" style={{ gap: '18px' }}>
          <div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, marginBottom: '8px', color: 'var(--ink)' }}>
                نوع النشاط التجاري (لتخصيص المصطلحات وسلة الطلبات)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div
                  onClick={() => setRestProjectType('restaurant')}
                  style={{
                    border: restProjectType === 'restaurant' ? '2px solid #10b981' : '1px solid var(--line)',
                    background: restProjectType === 'restaurant' ? 'rgba(16, 185, 129, 0.14)' : 'color-mix(in srgb, var(--surface) 40%, transparent)',
                    backdropFilter: 'blur(14px) saturate(1.25)',
                    WebkitBackdropFilter: 'blur(14px) saturate(1.25)',
                    borderRadius: '16px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: '#059669',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <UtensilsCrossed size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)' }}>مطعم أو مقهى</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>أطعمة، وجبات، وكافيه</div>
                  </div>
                  {restProjectType === 'restaurant' && <CheckCircle2 size={18} color="#10b981" />}
                </div>

                <div
                  onClick={() => setRestProjectType('store')}
                  style={{
                    border: restProjectType === 'store' ? '2px solid #10b981' : '1px solid var(--line)',
                    background: restProjectType === 'store' ? 'rgba(16, 185, 129, 0.14)' : 'color-mix(in srgb, var(--surface) 40%, transparent)',
                    backdropFilter: 'blur(14px) saturate(1.25)',
                    WebkitBackdropFilter: 'blur(14px) saturate(1.25)',
                    borderRadius: '16px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: '#0ea5e9',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Store size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)' }}>متجر أو محل تجاري</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>منتجات، مبيعات، ومتاجر</div>
                  </div>
                  {restProjectType === 'store' && <CheckCircle2 size={18} color="#10b981" />}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '12px' }}>
              <label className="f" style={{ marginBottom: 0 }}>
                اسم المشروع *
                <input
                  type="text"
                  value={restName}
                  onChange={(e) => setRestName(e.target.value)}
                  style={themedInputStyle}
                  required
                />
              </label>

              <label className="f" style={{ marginBottom: 0 }}>
                الوصف المختصر أسفل الاسم (Tagline)
                <input
                  type="text"
                  value={restTagline}
                  onChange={(e) => setRestTagline(e.target.value)}
                  placeholder="مثال: برجر سماش طازج • بطاطا مقرمشة • مشروبات باردة"
                  style={themedInputStyle}
                />
              </label>
            </div>

            <label className="f">
              نبذة عن المشروع (تظهر في نافذة "نبذة عنا" للزبائن)
              <textarea
                rows={2}
                value={aboutTextInput}
                onChange={(e) => setAboutTextInput(e.target.value)}
                placeholder="اكتب قصة مشروعك، جودة المنتجات، وساعات الخدمة..."
                style={themedInputStyle}
              />
            </label>

            <label className="f" style={{ marginBottom: 0 }}>
              ملاحظة الضريبة أو الفاتورة أسفل المنيو
              <input
                type="text"
                value={taxNoteInput}
                onChange={(e) => setTaxNoteInput(e.target.value)}
                placeholder="مثال: جميع الأسعار شاملة الضريبة"
                style={themedInputStyle}
              />
            </label>
          </div>

          <div style={{ height: '1px', background: 'var(--line)' }} />

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--ink)', margin: '0 0 12px' }}>
              التواصل والواتساب والسوشيال ميديا 📱
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <label className="f">
                رقم هاتف الاتصال
                <input
                  type="tel"
                  dir="ltr"
                  value={restPhone}
                  onChange={(e) => setRestPhone(e.target.value)}
                  placeholder="07701234567"
                  style={{ ...themedInputStyle, textAlign: 'left' }}
                />
              </label>

              <label className="f">
                رقم الواتساب لاستقبال الطلبات{' '}
                {orderChannel === 'telegram' ? '(اختياري عند اختيار تيليجرام فقط)' : '*'}
                <input
                  type="tel"
                  dir="ltr"
                  value={restWa}
                  onChange={(e) => setRestWa(e.target.value)}
                  placeholder="07711448594"
                  style={{ ...themedInputStyle, textAlign: 'left' }}
                  required={orderChannel !== 'telegram'}
                />
              </label>
            </div>

            <label className="f">
              عنوان ومقر المشروع بالتفصيل
              <input
                type="text"
                value={restAddress}
                onChange={(e) => setRestAddress(e.target.value)}
                placeholder="بغداد، الكرادة..."
                style={themedInputStyle}
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <label className="f">
                رابط موقع المشروع على خرائط جوجل
                <input
                  type="text"
                  dir="ltr"
                  value={restMapUrl}
                  onChange={(e) => setRestMapUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  style={{ ...themedInputStyle, textAlign: 'left' }}
                />
              </label>

              <label className="f">
                رابط تقييمات Google Maps (اختياري)
                <input
                  type="text"
                  dir="ltr"
                  value={restGoogleReviewUrl}
                  onChange={(e) => setRestGoogleReviewUrl(e.target.value)}
                  placeholder="https://g.page/r/..."
                  style={{ ...themedInputStyle, textAlign: 'left' }}
                />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <label className="f" style={{ marginBottom: 0 }}>
                حساب الانستقرام
                <input
                  type="text"
                  dir="ltr"
                  value={restInstagram}
                  onChange={(e) => setRestInstagram(e.target.value)}
                  placeholder="https://instagram.com/..."
                  style={{ ...themedInputStyle, textAlign: 'left' }}
                />
              </label>

              <label className="f" style={{ marginBottom: 0 }}>
                صفحة الفيسبوك
                <input
                  type="text"
                  dir="ltr"
                  value={restFacebook}
                  onChange={(e) => setRestFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  style={{ ...themedInputStyle, textAlign: 'left' }}
                />
              </label>

              <label className="f" style={{ marginBottom: 0 }}>
                حساب التيك توك
                <input
                  type="text"
                  dir="ltr"
                  value={restTiktok}
                  onChange={(e) => setRestTiktok(e.target.value)}
                  placeholder="https://tiktok.com/@..."
                  style={{ ...themedInputStyle, textAlign: 'left' }}
                />
              </label>
            </div>
          </div>
          </div>
        </motion.section>

        {/* SECTION 5: ساعات العمل ومناطق التوصيل */}
        <motion.section
          id="sec-delivery"
          className="mp-set-sec"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.06 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mp-set-sec-head">
            <h2 className="mp-set-sec-title">
              <span className="mp-set-sec-num">5</span>
              <span>ساعات العمل الأسبوعية وأسعار ومناطق التوصيل</span>
            </h2>
          </div>

          <div className="mp-set-card">
            <div>
              <label className="f" style={{ marginBottom: '8px' }}>
                نظام أوقات وساعات فتح المتجر
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className={workMode === '24' ? 'btn p s' : 'btn s'}
                    onClick={() => setWorkMode('24')}
                  >
                    مفتوح 24 ساعة (طوال الأسبوع)
                  </button>
                  <button
                    type="button"
                    className={workMode === 'c' ? 'btn p s' : 'btn s'}
                    onClick={() => setWorkMode('c')}
                  >
                    جدول أيام أسبوعي مخصص (يبدأ بالأحد)
                  </button>
                </div>
              </label>

              {workMode === 'c' && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '10px 0 0',
                    borderRadius: 0,
                    background: 'transparent',
                    border: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                      paddingBottom: '10px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)' }}>التوقيت الموحد السريع:</span>
                      <input
                        type="time"
                        value={workFrom}
                        onChange={(e) => setWorkFrom(e.target.value)}
                        style={{ ...themedInputStyle, width: 'auto', padding: '5px 8px', fontSize: '12.5px' }}
                      />
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>إلى</span>
                      <input
                        type="time"
                        value={workTo}
                        onChange={(e) => setWorkTo(e.target.value)}
                        style={{ ...themedInputStyle, width: 'auto', padding: '5px 8px', fontSize: '12.5px' }}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn s"
                      onClick={() => applyTimeToOpenDays(workFrom, workTo)}
                      style={{ fontSize: '12px', fontWeight: 800 }}
                    >
                      تطبيق على كل الأيام المفتوحة
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {WEEK_DAYS_ORDER.map(({ key, label }) => {
                      const dayCfg = weeklyHours[key] || { open: true, from: workFrom, to: workTo };
                      return (
                        <div
                          key={key}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '8px',
                            padding: '8px 2px',
                            borderRadius: 0,
                            background: 'transparent',
                            border: 0,
                            borderBottom: '1px solid var(--line)',
                            opacity: dayCfg.open ? 1 : 0.68,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '130px' }}>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={dayCfg.open}
                              aria-label={`${label} ${dayCfg.open ? 'مفتوح' : 'مغلق'}`}
                              onClick={() =>
                                setWeeklyHours((prev) => ({
                                  ...prev,
                                  [key]: { ...dayCfg, open: !dayCfg.open },
                                }))
                              }
                              className={`ios-switch ${dayCfg.open ? 'on' : 'off'}`}
                            >
                              <span className="ios-switch-thumb" />
                            </button>
                            <span style={{ fontWeight: 800, fontSize: '13px', color: 'var(--ink)' }}>{label}</span>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: dayCfg.open ? '#10b981' : '#ef4444' }}>
                              {dayCfg.open ? 'مفتوح' : 'مغلق'}
                            </span>
                          </div>

                          {dayCfg.open && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <input
                                type="time"
                                value={dayCfg.from || workFrom}
                                onChange={(e) =>
                                  setWeeklyHours((prev) => ({
                                    ...prev,
                                    [key]: { ...dayCfg, from: e.target.value },
                                  }))
                                }
                                style={{ ...themedInputStyle, width: 'auto', padding: '5px 8px', fontSize: '12.5px' }}
                              />
                              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>—</span>
                              <input
                                type="time"
                                value={dayCfg.to || workTo}
                                onChange={(e) =>
                                  setWeeklyHours((prev) => ({
                                    ...prev,
                                    [key]: { ...dayCfg, to: e.target.value },
                                  }))
                                }
                                style={{ ...themedInputStyle, width: 'auto', padding: '5px 8px', fontSize: '12.5px' }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div style={{ paddingTop: '14px', borderTop: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} style={{ color: 'var(--brand-ink, #34D399)' }} />
                  <b style={{ fontSize: '14px', color: 'var(--ink)' }}>أسعار التوصيل حسب المحافظة والمنطقة / القضاء</b>
                </div>
                <button
                  type="button"
                  className="btn s"
                  onClick={() =>
                    setDeliveryZonesState((prev) => [...prev, { area: '', fee: 2000, cities: [] }])
                  }
                >
                  <Plus size={14} />
                  <span>إضافة محافظة / منطقة</span>
                </button>
              </div>

              {deliveryZonesState.length === 0 ? (
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>
                  لم تُضف مناطق توصيل بعد. يمكنك إضافة منطقة بسعر مباشر، أو محافظة وتحتها عدة أقضية/مناطق بأسعار مختلفة لتظهر في سلة الزبون.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {deliveryZonesState.map((zone, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'transparent',
                        border: 0,
                        borderBottom: '1px solid var(--line)',
                        borderRadius: 0,
                        padding: '12px 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(130px, 1fr) 115px auto', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={zone.area}
                          onChange={(e) =>
                            setDeliveryZonesState((prev) =>
                              prev.map((z, i) => (i === idx ? { ...z, area: e.target.value } : z))
                            )
                          }
                          placeholder="المحافظة أو المنطقة (مثال: بغداد / الكرادة)"
                          style={themedInputStyle}
                        />
                        <input
                          type="number"
                          min={0}
                          value={zone.fee}
                          onChange={(e) =>
                            setDeliveryZonesState((prev) =>
                              prev.map((z, i) => (i === idx ? { ...z, fee: Number(e.target.value) || 0 } : z))
                            )
                          }
                          placeholder={`الأجرة (${restCurrency})`}
                          style={themedInputStyle}
                        />
                        <button
                          type="button"
                          onClick={() => setDeliveryZonesState((prev) => prev.filter((_, i) => i !== idx))}
                          title="حذف المحافظة / المنطقة"
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {zone.cities && zone.cities.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingInlineStart: '12px', borderInlineStart: '2px solid var(--line)' }}>
                          {zone.cities.map((city, cIdx) => (
                            <div key={cIdx} style={{ display: 'grid', gridTemplateColumns: 'minmax(110px, 1fr) 100px auto', gap: '6px', alignItems: 'center' }}>
                              <input
                                type="text"
                                value={city.name}
                                onChange={(e) =>
                                  setDeliveryZonesState((prev) =>
                                    prev.map((z, i) =>
                                      i === idx
                                        ? {
                                            ...z,
                                            cities: z.cities.map((c, j) => (j === cIdx ? { ...c, name: e.target.value } : c)),
                                          }
                                        : z
                                    )
                                  )
                                }
                                placeholder="اسم القضاء / الحي (مثال: المنصور)"
                                style={{ ...themedInputStyle, padding: '7px 10px', fontSize: '12.5px' }}
                              />
                              <input
                                type="number"
                                min={0}
                                value={city.fee}
                                onChange={(e) =>
                                  setDeliveryZonesState((prev) =>
                                    prev.map((z, i) =>
                                      i === idx
                                        ? {
                                            ...z,
                                            cities: z.cities.map((c, j) => (j === cIdx ? { ...c, fee: Number(e.target.value) || 0 } : c)),
                                          }
                                        : z
                                    )
                                  )
                                }
                                placeholder="الأجرة"
                                style={{ ...themedInputStyle, padding: '7px 10px', fontSize: '12.5px' }}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setDeliveryZonesState((prev) =>
                                    prev.map((z, i) =>
                                      i === idx ? { ...z, cities: z.cities.filter((_, j) => j !== cIdx) } : z
                                    )
                                  )
                                }
                                title="حذف الحي الفرعي"
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '8px',
                                  border: '1px solid rgba(239, 68, 68, 0.25)',
                                  background: 'rgba(239, 68, 68, 0.08)',
                                  color: '#ef4444',
                                  display: 'grid',
                                  placeItems: 'center',
                                  cursor: 'pointer',
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            setDeliveryZonesState((prev) =>
                              prev.map((z, i) =>
                                i === idx
                                  ? { ...z, cities: [...(z.cities || []), { name: '', fee: z.fee || 2000 }] }
                                  : z
                              )
                            )
                          }
                          style={{
                            background: 'var(--soft)',
                            color: 'var(--brand-ink, #34D399)',
                            border: '1px solid var(--line)',
                            borderRadius: '8px',
                            padding: '4px 10px',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          + إضافة قضاء / حي فرعي لهذه المنطقة
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.section>
      </form>

      <MediaLibraryModal
        isOpen={mediaPickerTarget !== null}
        items={mediaLibraryItems}
        currentUrl={mediaPickerTarget === 'logo' ? logoUrlInput : coverUrlInput}
        onSelect={(url) => {
          if (mediaPickerTarget === 'logo') {
            setLogoUrlInput(url);
          } else if (mediaPickerTarget === 'cover') {
            setCoverUrlInput(url);
          }
        }}
        onUploadFiles={uploadImagesToLibrary}
        onDeleteItem={(mediaId) => {
          const target = mediaLibraryItems.find((m) => m.id === mediaId);
          if (target) {
            if (target.url === logoUrlInput) setLogoUrlInput('');
            if (target.url === coverUrlInput) setCoverUrlInput('');
          }
          removeMediaLibraryItem(mediaId);
        }}
        onClose={() => setMediaPickerTarget(null)}
      />
    </div>
  );
};
