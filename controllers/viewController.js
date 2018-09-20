exports.collapsableTree = (req, res, next) => {
    res.render('pages/collapsable-tree', { user: req.user });
};