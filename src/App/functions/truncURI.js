export default (URI) => {
  const trunc = URI.match(/\S+(?=\?)/g)
  return trunc ? trunc[0] : URI
}
