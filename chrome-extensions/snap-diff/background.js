// SnapDiff Background Service Worker
// ExtensionPay setup

importScripts('ExtPay.js');
const extpay = ExtPay('snapdiff');
extpay.startBackground();
