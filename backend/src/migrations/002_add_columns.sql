-- =============================================
-- 002_add_columns.sql - Add new columns for approval, confirmation and scheduling
-- Run this migration to update existing database
-- =============================================

-- =============================================
-- USERS TABLE - Add approval columns
-- =============================================
-- Lý do từ chối (khi status = rejected)
ALTER TABLE users ADD COLUMN IF NOT EXISTS rejected_reason TEXT;

-- Người phê duyệt (admin/manager)
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(user_id) ON DELETE SET NULL;

-- Thời gian phê duyệt
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;

-- Index cho approved_by để query nhanh hơn
CREATE INDEX IF NOT EXISTS idx_user_approved_by ON users(approved_by);

-- =============================================
-- INVOICES TABLE - Add confirmation columns
-- =============================================
-- Người xác nhận thanh toán (admin/manager/accountant)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS confirmed_by UUID REFERENCES users(user_id) ON DELETE SET NULL;

-- Thời gian xác nhận thanh toán
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP;

-- Index cho confirmed_by để query nhanh hơn
CREATE INDEX IF NOT EXISTS idx_invoice_confirmed_by ON invoices(confirmed_by);

-- =============================================
-- NOTIFICATIONS TABLE - Add scheduling column
-- =============================================
-- Thời gian lên lịch gửi thông báo
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP;

-- Index cho scheduled_at để query thông báo đã lên lịch
CREATE INDEX IF NOT EXISTS idx_notification_scheduled ON notifications(scheduled_at) WHERE scheduled_at IS NOT NULL;

-- =============================================
-- COMMENTS
-- =============================================
-- users.rejected_reason: Lý do từ chối khi admin reject user đăng ký
-- users.approved_by: ID của admin/manager đã phê duyệt/từ chối user
-- users.approved_at: Thời điểm phê duyệt/từ chối
--
-- invoices.confirmed_by: ID của người xác nhận thanh toán hóa đơn
-- invoices.confirmed_at: Thời điểm xác nhận thanh toán
--
-- notifications.scheduled_at: Thời điểm thông báo sẽ được gửi (cho tính năng lên lịch)
