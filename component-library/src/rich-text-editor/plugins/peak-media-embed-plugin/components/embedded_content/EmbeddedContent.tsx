import React from 'react'
// eslint-disable-next-line no-unused-vars
import { StyledElementProps } from '@udecode/slate-plugins'
import './embedded-content.scss'
import { deriveHostname } from '../../../../../utils/urls'
import { ImageLoader } from '../../../../../common/image-loader/ImageLoader'
import { TweetContainer, YoutubeVideoContainer } from '..'

export const RichLinkEmbed = ({
  attributes,
  children,
  nodeProps,
  ...props
}: StyledElementProps) => {
  // eslint-disable-next-line camelcase
  const { title, url, cover_image_url, fav_icon_url, description } =
    props.element
  return (
    <div contentEditable={false} className='voidable-slate-element'>
      <a
        target='_blank'
        href={url}
        className='rich-link-preview-container'
        rel='noreferrer'
      >
        <div className='editor-rich-link-preview' {...attributes}>
          <div className='left-column'>
            {title ? <div className='title'>{title}</div> : null}
            {description ? (
              <div className='description'>{description}</div>
            ) : null}
            <div className='footer'>
              <ImageLoader
                // eslint-disable-next-line camelcase
                url={fav_icon_url}
                // @ts-ignore
                fallbackElement={null}
                className='fav-icon'
              />
              <div className='hostname'>{deriveHostname(url)}</div>
            </div>
          </div>
          <div className='right-column'>
            <ImageLoader
              // eslint-disable-next-line camelcase
              url={cover_image_url}
              // @ts-ignore
              fallbackElement={null}
              className='cover-image'
            />
          </div>
        </div>
      </a>
      {children}
    </div>
  )
}

export const TwitterEmbed = ({
  attributes,
  children,
  nodeProps,
  ...props
}: StyledElementProps) => {
  const embedUrl: string = props.element.url
  return (
    <div
      className='voidable-slate-element embedded-tweet'
      contentEditable={false}
    >
      <TweetContainer
        url={embedUrl}
        className='tweet-container media-container'
      />
      {children}
    </div>
  )
}

export const YoutubeEmbed = ({
  attributes,
  children,
  nodeProps,
  ...props
}: StyledElementProps) => {
  const embedUrl: string = props.element.url
  return (
    <div
      className='voidable-slate-element embedded-video'
      contentEditable={false}
    >
      <YoutubeVideoContainer url={embedUrl} />
      {children}
    </div>
  )
}
