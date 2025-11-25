import { User } from "../models/User";

export const getUsers = async (req, res) => {
    try {
        
        const { lastCreated, limit } = req.body;

        const data = await User.getUsersByLastCreatedAndLimit({ lastCreated, limit });

        if (!data || data.length === 0) {
            return res.status(200).json({ users: [] });
        }

        return res.status(200).json({ users: data });

    } catch (error) {
        console.error("Lỗi khi gọi getUsers", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const getPendingUsers = async (req, res) => {
    try {
        const data = await User.getPendingUsers();
        
        if (!data || data.length === 0) {
            return res.status(200).json({ users: [] });
        }

        return res.status(200).json({ users: data });
    } catch (error) {
        console.error("Lỗi khi gọi getPendingUsers", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const approveUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findUserById({ user_id: id });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user" });
        }
        
        if (user.status !== 'pending') {
            return res.status(400).json({ message: "Chỉ có thể duyệt các user đang chờ" });
        }

        await User.approveUser({ user_id: id, approved_by: req.user.user_id });
        
        return res.status(200).json({ message: "Duyệt user thành công" });
    } catch (error) {
        console.error("Lỗi khi gọi approveUser", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const rejectUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejected_reason } = req.body;
        
        const user = await User.findUserById({ user_id: id });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user" });
        }
        
        if (user.status !== 'pending') {
            return res.status(400).json({ message: "Chỉ có thể từ chối các user đang chờ" });
        }

        await User.rejectUser({ user_id: id, rejected_by: req.user.user_id, rejected_reason });

        return res.status(200).json({ message: "Từ chối user thành công" });
    } catch (error) {
        console.error("Lỗi khi gọi rejectUser", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

