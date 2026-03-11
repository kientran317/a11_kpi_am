import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default function handler(req: Request) {
  const url   = new URL(req.url);
  const p     = (k: string, fb = '—') => url.searchParams.get(k) ?? fb;
  const pf    = (k: string, fb = 0)   => parseFloat(url.searchParams.get(k) ?? String(fb));

  const wh       = p('wh');
  const date     = p('date');
  const cp       = p('cp');
  const severity = p('severity', 'ok');
  const pct      = pf('pct');
  const target   = pf('target', 90);
  const gap      = pf('gap');
  const ltc_on   = p('ltc_on', '0');
  const vol      = p('vol', '0');
  const a_pct    = p('a_pct', '0');
  const assigned = p('assigned', '0');
  const not_assign = p('not_assign', '0');
  const b_pct    = p('b_pct', '0');
  const ltc      = p('ltc', '0');
  const ltb      = p('ltb', '0');
  const pending  = p('pending', '0');
  const c_pct    = p('c_pct', '0');
  const ltc_ontime = p('ltc_ontime', '0');
  const ltc_late   = p('ltc_late', '0');

  const ALERT = '#E8380D';
  const WARN  = '#F59E0B';
  const OK    = '#16A34A';
  const GRAY  = '#6B7280';
  const DARK  = '#111827';
  const WHITE = '#FFFFFF';
  const BG    = '#F3F4F6';
  const CARD  = '#FFFFFF';
  const LINE  = '#E5E7EB';

  const kpiColor = severity === 'critical' ? ALERT : severity === 'warning' ? WARN : OK;
  const barFill  = Math.min(100, Math.max(0, (pct / target) * 100));

  const mc = (val: string, base: number) => {
    const n = parseFloat(val);
    if (isNaN(n)) return GRAY;
    return n < base - 15 ? ALERT : n < base - 5 ? WARN : OK;
  };

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: `1px solid ${LINE}` }}>
      <span style={{ color: GRAY, fontSize: 12 }}>{label}</span>
      <span style={{ color: DARK, fontSize: 13, fontWeight: 700 }}>{value}</span>
    </div>
  );

  const Card = ({ label, val, color, rows }: { label: string; val: string; color: string; rows: { label: string; value: string }[] }) => (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: CARD, borderRadius: 12, padding: '16px 18px', border: `1px solid ${LINE}`, gap: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ color: DARK, fontSize: 14, fontWeight: 700 }}>{label}</span>
        <span style={{ color, fontSize: 26, fontWeight: 800 }}>{val}%</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {rows.map((r, i) => <Row key={i} label={r.label} value={r.value} />)}
      </div>
    </div>
  );

  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', width: 800, background: BG, fontFamily: 'system-ui, sans-serif', padding: 16, gap: 12, borderRadius: 16 }}>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', background: DARK, borderRadius: 10, padding: '12px 20px', gap: 8 }}>
        <span style={{ color: WHITE, fontSize: 14, fontWeight: 700 }}>📍 BƯU CỤC {wh}</span>
        <span style={{ color: '#4B5563', fontSize: 13 }}>|</span>
        <span style={{ color: '#9CA3AF', fontSize: 13 }}>{date}</span>
        <span style={{ color: '#4B5563', fontSize: 13 }}>|</span>
        <span style={{ color: '#9CA3AF', fontSize: 13 }}>Checkpoint {cp}</span>
      </div>

      {/* PRIMARY KPI */}
      <div style={{ display: 'flex', alignItems: 'center', background: CARD, borderRadius: 12, padding: '18px 24px', border: `1px solid ${LINE}`, gap: 20 }}>

        {/* left: label + big number */}
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 260 }}>
          <span style={{ color: GRAY, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            TỶ LỆ LẤY THÀNH CÔNG ĐÚNG GIỜ
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
            <span style={{ color: kpiColor, fontSize: 44, fontWeight: 900, lineHeight: 1 }}>{pct.toFixed(2)}%</span>
            <span style={{ color: kpiColor, fontSize: 14, fontWeight: 600 }}>
              ({gap >= 0 ? '+' : ''}{gap.toFixed(1)}pp)
            </span>
          </div>
        </div>

        {/* middle: bar */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: GRAY, fontSize: 11 }}>0%</span>
            <span style={{ color: GRAY, fontSize: 11 }}>Mục tiêu: {target}%</span>
          </div>
          <div style={{ width: '100%', height: 12, background: LINE, borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: `${barFill}%`, height: '100%', background: kpiColor, borderRadius: 99 }} />
          </div>
          {/* target marker label */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ color: GRAY, fontSize: 10 }}>▲ {target}%</span>
          </div>
        </div>

        {/* right: count */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 160 }}>
          <span style={{ color: GRAY, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Đã lấy đúng giờ</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ color: DARK, fontSize: 30, fontWeight: 800 }}>{ltc_on}</span>
            <span style={{ color: GRAY, fontSize: 13 }}>/ {vol} đơn</span>
          </div>
        </div>
      </div>

      {/* 3 METRIC CARDS */}
      <div style={{ display: 'flex', gap: 12 }}>
        <Card label="%Gán" val={a_pct} color={mc(a_pct, 90)}
          rows={[{ label: 'Đơn đã gán', value: assigned }, { label: 'Đơn cần gán', value: not_assign }]} />
        <Card label="%LTC/Gán" val={b_pct} color={mc(b_pct, 85)}
          rows={[{ label: 'Đơn đã LTC', value: ltc }, { label: 'Đơn LTB', value: ltb }, { label: 'Đơn chờ cập nhật', value: pending }]} />
        <Card label="%OPR" val={c_pct} color={mc(c_pct, 90)}
          rows={[{ label: 'Đơn LTC đúng giờ', value: ltc_ontime }, { label: 'Đơn LTC trễ', value: ltc_late }]} />
      </div>

    </div>,
    { width: 800, height: 380 }
  );
}
