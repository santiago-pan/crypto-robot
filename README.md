# Crypto robot
Setting SELL/BUY orders automatically on Binance.

# How to

## Dev mode run

`yarn start:dev`

## Build

`yarn build`

## Production run

`yarn start`

## NodeJS and Typescript starter

Create project

`npm init -y`

Install typescript

`npm install --save-dev typescript`

Add `tsconfig.json`

```
{
  "compilerOptions": {
    "target": "ES2016",
    "lib": [
      "ES6"
    ],
    "module": "CommonJS",
    "rootDir": "src",
    "resolveJsonModule": true,
    "allowJs": true,
    "outDir": "build",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitAny": true,
    "skipLibCheck": true
  },
  "include": [
    "src"
  ]
}
```

## PM2

`pm2 start app.js`

`pm2 monit`

`pm2 list`

`pm2 stop`

`pm2 restart`
