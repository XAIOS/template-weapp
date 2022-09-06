export default function(count, next) {
  if (count) {
    let load = 0
    return () => ++load == count && next()
  } else {
    next()
  }
}
