export function sortHelper(sort) {
  // If parameter not provided default is descending,
  // if a parameter is not descending or ascending bad request
  const newSort = sort ? sort : 'descending'
  if (![ 'descending', 'ascending' ].includes(newSort)) {
    return res.status(400).send(`invalid query parameter value sort=${sort}`)
  }
  return sort
}

export function replacer(key, value) {
  if (key === '__v') return undefined
  return value
}
