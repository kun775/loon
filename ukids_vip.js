/**
 * uKids VIP 解锁脚本
 *
 * 拦截接口：GET https://prod.ukids.cn/uch5/getUser
 *
 * 覆盖字段：
 *   vip / vipReal / svip / type / typeReal / svipType
 *   vipEnd / vipEndReal / svipEnd
 *   vipTotal / svipTotal / vipEffect / svipEffect
 */

// ── 固定解锁配置 ────────────────────────────────────────────────
const VIP_STATUS = 1;
const SVIP_STATUS = 1;
const EXPIRY_DATE = "2099-12-31";
const TOTAL_DAYS = 365;
const EFFECT_DAYS = 365;

// ── 触发确认（调试用，确认后可删除）──────────────────────────────────
console.log("[ukids_vip] ✅ 脚本已触发，URL=" + $request.url);

// ── 解析响应体 ──────────────────────────────────────────────────
let obj;
try {
  obj = JSON.parse($response.body);
} catch (e) {
  console.log("[ukids_vip] JSON 解析失败：" + e.message);
}

// ── 修改 VIP 相关字段 ───────────────────────────────────────────
if (obj && obj.success && obj.data) {
  const d = obj.data;

  // 状态字段
  d.vip = VIP_STATUS;
  d.vipReal = VIP_STATUS;
  d.svip = SVIP_STATUS;
  d.type = VIP_STATUS;
  d.typeReal = VIP_STATUS;
  d.svipType = SVIP_STATUS;

  // 到期日期（vipEnd / vipEndReal / svipEnd 统一使用同一日期）
  d.vipEnd = EXPIRY_DATE;
  d.vipEndReal = EXPIRY_DATE;
  d.svipEnd = EXPIRY_DATE;

  // 天数统计
  d.vipTotal = TOTAL_DAYS;
  d.svipTotal = TOTAL_DAYS;
  d.vipEffect = EFFECT_DAYS;
  d.svipEffect = EFFECT_DAYS;

  console.log(
    "[ukids_vip] VIP 字段已修改 → vip=" +
      VIP_STATUS +
      " svip=" +
      SVIP_STATUS +
      " expiry=" +
      EXPIRY_DATE,
    );
}

$done({ body: obj ? JSON.stringify(obj) : $response.body });
