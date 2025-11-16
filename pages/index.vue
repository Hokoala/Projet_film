<template>
  <div class="container mx-auto p-8">
    <UCard>
      <template #header>
        <h1 class="text-4xl font-bold">Bienvenue sur Utopia</h1>
      </template>
      <p class="mt-4 text-lg">
        Connectez-vous ou inscrivez-vous pour découvrir et accéder aux films.
      </p>
    </UCard>


    <div class="mt-12">
      <h2 class="text-3xl font-bold mb-6 text-gray-800">Films à l'affiche</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="film in films"
          :key="film.id"
          class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
        >
          <img
            :src="film.poster"
            :alt="film.title"
            class="w-full h-80 object-cover"
          />
          <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ film.title }}</h3>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const api = String(config.public.apiUrl);

console.log("API:" + api);

// Tableau JSON des films
const films = ref([
  {
    id: 1,
    title: 'Titanic',
    slug: 'titanic',
    released: '19 Dec 1997',
    director: 'James Cameron',
    actors: 'Leonardo DiCaprio, Kate Winslet, Billy Zane, Kathy Bates',
    poster: 'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg',
    plot: '84 years later, a 100 year-old woman named Rose DeWitt Bukater tells the story to her granddaughter about her life set in April 10th 1912, on a ship called Titanic.',
    metascore: '75'
  },
  {
    id: 2,
    title: 'Blade Runner',
    slug: 'blade-runner',
    released: '25 Jun 1982',
    director: 'Ridley Scott',
    actors: 'Harrison Ford, Rutger Hauer, Sean Young, Edward James Olmos',
    poster: 'https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
    plot: 'A blade runner must pursue and terminate four replicants who stole a ship in space, and have returned to Earth to find their creator.',
    metascore: '89'
  },
  {
    id: 3,
    title: 'The Shining',
    slug: 'the-shining',
    released: '13 Jun 1980',
    director: 'Stanley Kubrick',
    actors: 'Jack Nicholson, Shelley Duvall, Danny Lloyd, Scatman Crothers',
    poster: 'https://m.media-amazon.com/images/M/MV5BZWFlYmY2MGEtZjVkYS00YzU4LTg0YjQtYzY1ZGE3NTA5NGQxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    plot: 'A family heads to an isolated hotel for the winter where an evil spiritual presence influences the father into violence, while his psychic son sees horrific forebodings.',
    metascore: '63'
  },
  {
    id: 4,
    title: 'Inception',
    slug: 'inception',
    released: '16 Jul 2010',
    director: 'Christopher Nolan',
    actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page, Tom Hardy',
    poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    metascore: '74'
  },
  {
    id: 5,
    title: 'The Matrix',
    slug: 'the-matrix',
    released: '31 Mar 1999',
    director: 'Lana Wachowski, Lilly Wachowski',
    actors: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving',
    poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
    plot: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    metascore: '73'
  },
  {
    id: 6,
    title: 'Interstellar',
    slug: 'interstellar',
    released: '07 Nov 2014',
    director: 'Christopher Nolan',
    actors: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine',
    poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
    plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    metascore: '74'
  }
]);
</script>

<style scoped>
</style>
