module.exports = function() {
    require('./auth.route')(...arguments);
    require('./annex.route')(...arguments);
    require('./user.route')(...arguments);
};
