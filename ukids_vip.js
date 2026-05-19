/**
 * uKids VIP 解锁脚本
 *
 * 拦截接口：
 *   GET https://prod.ukids.cn/uch5/getUser
 *   GET https://fastapi.ukids.cn/ucapp/sync
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

// unlockVipUser 固定改写用户会员字段。
//
// 参数:
//   - user object: 用户会员字段对象
//
// 元数据:
//   - 作者: VitaHuang
//   - 创建时间: 2026-05-19
//   - 更新时间: 2026-05-19
//   - 更新内容: 抽取会员字段改写逻辑，兼容 getUser 和 sync 接口。
function unlockVipUser(user) {
  // 状态字段
  user.vip = VIP_STATUS;
  user.vipReal = VIP_STATUS;
  user.svip = SVIP_STATUS;
  user.type = VIP_STATUS;
  user.typeReal = VIP_STATUS;
  user.svipType = SVIP_STATUS;

  // 到期日期（vipEnd / vipEndReal / svipEnd 统一使用同一日期）
  user.vipEnd = EXPIRY_DATE;
  user.vipEndReal = EXPIRY_DATE;
  user.svipEnd = EXPIRY_DATE;

  // 天数统计
  user.vipTotal = TOTAL_DAYS;
  user.svipTotal = TOTAL_DAYS;
  user.vipEffect = EFFECT_DAYS;
  user.svipEffect = EFFECT_DAYS;
}

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
  const user = obj.data.user || obj.data;
  unlockVipUser(user);

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
