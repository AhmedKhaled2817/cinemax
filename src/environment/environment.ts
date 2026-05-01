// src/environments/environment.ts
export const environment = {
  production: false,
  tmdb: {
    apiKey: '06a0738207ba14ae62d795fd9927d933',
    baseUrl: 'https://api.themoviedb.org/3',
    imageUrl: 'https://image.tmdb.org/t/p',
    imageSizes: {
      backdrop: 'w1280',
      poster: 'w500',
      profile: 'w185',
      still: 'w300'
    }
  }
};
