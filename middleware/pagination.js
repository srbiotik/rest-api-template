export default function(req, res, next) {
  try {
    const page = req.params.page ? req.params.page : 1
    req.docsPerPage = req.query.docsPerPage ? Number(req.query.docsPerPage) : 0
    req.docsToSkip = Number(page) ? page * req.docsPerPage : 0
    return next()
  } catch (err) {
    return res.status(400).send(`Bad request ${err.name}`)
  }
}
