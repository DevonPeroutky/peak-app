import React from 'react'
import cn from 'classnames'

export const YoutubeVideoContainer = (props: {
  url: string
  className?: string
}) => {
  const { url, className } = props
  // og: https://www.youtube.com/watch?v=oVgn5s13H6Y
  // dest: https://www.youtube.com/embed/oVgn5s13H6Y
  // eslint-disable-next-line camelcase
  const og_url = new URL(url)
  const videoId = og_url.searchParams.get('v')
  const embeddedUrl: string = `https://www.youtube.com/embed/${videoId}`

  return (
    <iframe src={embeddedUrl} className={cn('youtube-container', className)} />
  )
}
