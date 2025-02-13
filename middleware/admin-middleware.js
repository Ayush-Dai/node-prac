

const isAdminUser = (req, res, next) => {
    if (req.userInfo.role !== 'admin') {  //it get the role from auth-middleware because it is called at first
        return res.status(403).json({
            success: false,
            message: 'Access denied ! Admin rights required'
        })
    }
    next();
}

module.exports = isAdminUser;
