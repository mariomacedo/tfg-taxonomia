exports.taxonomia = (req, res, next) => {
    res.render('pages/taxonomia', { user: req.user });
};

exports.collapsableTree = (req, res, next) => {
    res.render('pages/collapsable-tree', { user: req.user });
};