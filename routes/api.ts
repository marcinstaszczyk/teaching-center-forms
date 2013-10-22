var dao = require("../src/dao");

export function dictionaries(req, res) {
  dao.getDictionaries(function (dicts) {
    res.json(dicts);
  });
};

export var forms = {
  list: function (req, res) {
    dao.forms.list(function (err, items) {
      res.json(items);
    });
  },
  get: function (req, res) {
    var id = ~~req.params.id;
    dao.forms.get(id, function (err, item) {
      res.json(formatRespData(err, item));
    });
  },
  post: function (req, res) {
    var form = req.body;
    dao.forms.saveOrUpdate(form, function (err) {
      res.json(formatRespData(err, null));
    });
  }
}



function formatRespData (err, content) {
  if (err) {
    console.log(err);
  }
  return {
    code: err ? 0 : 1,
    err: err,
    content: content
  }
}