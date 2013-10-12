var dao = require("../src/dao");

export function formsList(req, res) {
  dao.getForms(function (err, items) {
//    res.json({error : err, forms: items});
//    res.json({code : 1, content: items});
    res.json(items);
  });
};

export function dictionaries(req, res) {
  dao.getDictionaries(function (dicts) {
    res.json(dicts);
  });
};
