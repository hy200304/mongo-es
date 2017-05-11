import { Readable } from 'stream'

let consumedReadCapacity = 0

export function controlReadCapacity(stream: Readable, provisionedReadCapacity?: number): Readable {
  if (!provisionedReadCapacity) {
    return stream
  }
  const timer = setInterval(() => {
    consumedReadCapacity = 0
    stream.resume()
  }, 1000)
  stream.addListener('data', (doc) => {
    consumedReadCapacity++
    if (consumedReadCapacity >= provisionedReadCapacity) {
      stream.pause()
    }
  })
  stream.addListener('end', () => {
    clearInterval(timer)
  })
  return stream
}
