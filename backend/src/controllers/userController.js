import { User } from "../models/User.js";

export const authMe = async (req, res) => {
    try {
        const user_id = req.user?.user_id;

        const user = await User.findUserById({user_id: user_id});

        return res.status(200).json(user);
    } catch (error) {
        console.error('Lỗi khi gọi authMe', error);
        return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};