export default function(req, res, next) {
  let sort
  sort = req.query.sort ? req.query.sort : 'descending'
  if (![ 'descending', 'ascending' ].includes(sort)) {
    return res.status(400).send(`invalid query parameter value sorting=${sort}`)
  }
  req.query.sort = sort
  return next()
}
