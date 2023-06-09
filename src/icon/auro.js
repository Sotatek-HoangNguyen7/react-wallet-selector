import React, { useState, useEffect } from 'react'

const Auro = () => {
  return (
    <svg
      width='90'
      height='90'
      viewBox='0 0 100 100'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M0 20C0 10.5719 0 5.85786 2.92893 2.92893C5.85786 0 10.5719 0 20 0H80C89.4281 0 94.1421 0 97.0711 2.92893C100 5.85786 100 10.5719 100 20V80C100 89.4281 100 94.1421 97.0711 97.0711C94.1421 100 89.4281 100 80 100H20C10.5719 100 5.85786 100 2.92893 97.0711C0 94.1421 0 89.4281 0 80V20Z'
        fill='url(#paint0_linear_3510_7137)'
      />
      <mask
        id='mask0_3510_7137'
        style={{ maskType: 'alpha' }}
        maskUnits='userSpaceOnUse'
        x='0'
        y='0'
        width='100'
        height='100'
      >
        <path
          d='M0 20C0 10.5719 0 5.85786 2.92893 2.92893C5.85786 0 10.5719 0 20 0H80C89.4281 0 94.1421 0 97.0711 2.92893C100 5.85786 100 10.5719 100 20V80C100 89.4281 100 94.1421 97.0711 97.0711C94.1421 100 89.4281 100 80 100H20C10.5719 100 5.85786 100 2.92893 97.0711C0 94.1421 0 89.4281 0 80V20Z'
          fill='#87B9F8'
        />
      </mask>
      <g mask='url(#mask0_3510_7137)'>
        <g filter='url(#filter0_f_3510_7137)'>
          <circle cx='99.5' cy='11.5' r='38.5' fill='#D65A5A' />
        </g>
        <path
          d='M-34 84.4426L30 25L73.52 31.0656L78 82.0164L24.24 136L-13.52 121.443L-34 84.4426Z'
          fill='url(#paint1_linear_3510_7137)'
          fillOpacity='0.8'
        />
        <path
          d='M49.91 18.1C55.55 18.1 60.47 19.21 64.67 21.43C68.87 23.65 72.11 26.95 74.39 31.33C76.73 35.65 77.9 40.9 77.9 47.08V82H66.2V65.8H33.44V82H21.92V47.08C21.92 40.9 23.06 35.65 25.34 31.33C27.68 26.95 30.95 23.65 35.15 21.43C39.35 19.21 44.27 18.1 49.91 18.1ZM66.2 55.99V46C66.2 40.18 64.76 35.8 61.88 32.86C59 29.86 54.98 28.36 49.82 28.36C44.66 28.36 40.64 29.86 37.76 32.86C34.88 35.8 33.44 40.18 33.44 46V55.99H66.2Z'
          fill='black'
          fillOpacity='0.1'
        />
        <path
          d='M49.91 18.1C55.55 18.1 60.47 19.21 64.67 21.43C68.87 23.65 72.11 26.95 74.39 31.33C76.73 35.65 77.9 40.9 77.9 47.08V82H66.2V65.8H33.44V82H21.92V47.08C21.92 40.9 23.06 35.65 25.34 31.33C27.68 26.95 30.95 23.65 35.15 21.43C39.35 19.21 44.27 18.1 49.91 18.1ZM66.2 55.99V46C66.2 40.18 64.76 35.8 61.88 32.86C59 29.86 54.98 28.36 49.82 28.36C44.66 28.36 40.64 29.86 37.76 32.86C34.88 35.8 33.44 40.18 33.44 46V55.99H66.2Z'
          fill='white'
        />
      </g>
      <defs>
        <filter
          id='filter0_f_3510_7137'
          x='11'
          y='-77'
          width='177'
          height='177'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='BackgroundImageFix'
            result='shape'
          />
          <feGaussianBlur
            stdDeviation='25'
            result='effect1_foregroundBlur_3510_7137'
          />
        </filter>
        <linearGradient
          id='paint0_linear_3510_7137'
          x1='74'
          y1='-45'
          x2='78.8354'
          y2='120.707'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#CA5C89' />
          <stop offset='0.463031' stopColor='#4F55EC' />
          <stop offset='1' stopColor='#3531FF' />
        </linearGradient>
        <linearGradient
          id='paint1_linear_3510_7137'
          x1='63.28'
          y1='43.1967'
          x2='-7.99709'
          y2='110.69'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#2821A7' stopOpacity='0.63' />
          <stop offset='1' stopColor='#2821A7' stopOpacity='0' />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default Auro
