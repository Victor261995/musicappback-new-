import {PrismaClient} from '@prisma/client'

const prisma=new PrismaClient()

export const albumesSeed = async () => {

try{
    const albumsData=[
        {
titulo:' The Ilusion of Progress',
artista:'Staind',
anio:2008,
caratula:'https://m.media-amazon.com/images/I/718HukiBT2L._UF1000,1000_QL80_.jpg',
genero:'Rock/Numetal',
recomendado:true,
canciones: [
    { title: 'This Is It' },
    { title: 'The Way I Am' },
    { title: 'Believe' },
    { title: 'Save Me' },
    { title: 'All I Want' },
    { title: 'Pardon Me' },
    { title: 'Lost Along The Way' },
    { title: 'Break Away' },
    { title: 'Tangled Up in You ' },
    { title: 'Raining Again' },
    { title: 'Rainy Day Parade' },
    { title: 'The Corner' },
    { title: 'Nothing Left to say' },
    ]},{

            titulo:'En Vivo en la Sala  ',
            artista:'Dancing Mood',
            anio:2022,
            caratula:'https://cdns-images.dzcdn.net/images/cover/640028275ebf8af63e3f62168937648f/500x500.jpg',
recomendado:false,
 genero:'Ska/Reggae',
 canciones: [
    { title: 'The killer' },
    { title: 'Blowing and Make Bottles' },
    { title: 'Dancing Mood Style' },
    { title: 'Youre so delightfull' },
    { title: 'Adios Nonino' },
    { title: 'Africa' },
    { title: 'On The Good Road' },
    { title: 'Take Five' },
    { title: '20 Minutos/Monkey man ' },
    { title: 'A mis Abuelos ' },
    

    ]}
        ,{

            titulo:'Live From the Bostom Woods',
            artista:'Dispatch',
            anio:2023,
            caratula:'https://f4.bcbits.com/img/a1674099522_10.jpg',
            genero:'Reggae/Rock',
            recomendado:false,
            canciones: [
                { title: 'Passserby' },
                { title: 'Break Our Fall' },
                { title: 'Open Up' },
                { title: 'Only The Wild Ones' },
                { title: 'Painted Yelllow Lines' },
                { title: 'Bang Bang' },
                { title: 'Past The Falls ' },
                { title: 'Outloud' },
                { title: 'Flying Horses ' },
                { title: 'Loookin Out My Back Door' },
                { title: 'Elias' },
                { title: 'Came For the Fire' },
                { title: 'The General' },
                { title: 'Its The End Of The World As We Know It (And I Feel Fine)' },
                { title: 'Letter To Lady J ' },
          ]      }
        ,{

            titulo:'Unlimited Love',
            artista:'Red Hot Chili Peppers ',
            anio:2022,
            caratula:' https://a3.cdn.hhv.de/items/images/generated/970x970/00892/892275/2-red-hot-chili-peppers-unlimited-love-black-vinyl-edition.webp',
            genero:'Rock/Funk',
            recomendado:true,
            canciones: [
                { title: 'Its Only Natural' },
                { title: 'The Great Apes' },
                { title: 'Black Summer' },
                { title: 'The Heavy Wing' },
                { title: 'These Are The ways' },
                { title: 'Tangelo' },
                { title: 'Aquatic Mouth Dance ' },
                { title: 'Let´em Cry' },
                { title: 'Veronica ' },
                { title: 'Not The One' },
                { title: 'Bastard of Light' },
                { title: 'White Braids & Pilow Chair' },
                { title: 'Here Ever After' },
                { title: 'One Way Traffic' },
                { title: 'Watchu Thinkin´' },
                { title: 'She´s a Lover' },
          ]
    }
        ,{

            titulo:'Oktubre',
            artista:'Patricio Rey y Sus Redonditos de Ricota ',
            anio:1986,
            caratula:'https://i.scdn.co/image/ab67616d0000b273c7c1ffa44473871a6f004786',
           genero:'Rock',
           recomendado:true,
           canciones: [
            { title: 'Fuegos De Octubre' },
            { title: 'Preso en mi Ciudad' },
            { title: 'Musica para Pastillas' },
            { title: 'Semen-Up' },
            { title: 'Divina TV.Fuhrer' },
            { title: 'Motor Psico' },
            { title: 'Jijiji' },
            { title: 'Cancion Para Naufragos' },
            { title: 'Ya Nadie Va a Escuchar Tu Remera  ' },
            


    ]}
        
    
    ,{

            titulo:'Audioslave',
            artista:'Audioslave',
            anio:2002,
            caratula:'https://www.udiscovermusic.com/wp-content/uploads/2018/11/Audioslave-debut-album-cover-artwork-web-optimised-820.jpg',
genero:'Rock/Hard Rock',
recomendado:false,
canciones: [
    { title: 'Cochoise' },
    { title: 'Show Me How To Live' },
    { title: 'Gasoline' },
    { title: 'What You Are' },
    { title: 'Like Stone' },
    { title: 'Set It Off' },
    { title: 'Shadow of The Sun' },
    { title: 'I Am the Highway' },
    { title: 'Explorer ' },
    { title: 'Hypnotize' },
    { title: 'Bring Em Back Alive' },
    { title: 'Light My Way' },
    { title: 'Getaway Car' },
    { title: 'The Last Remaining Light' },
    ]}];

for (const album of albumsData) {
    const { canciones, ...albums } = album;

    const createdAlbum = await prisma.album.create({
      data: { ...albums },
    });

    if (canciones && canciones.length > 0) 
    {for (const cancion of canciones) {
    await prisma.song.create({
data: {
title: cancion.title,
albumId: createdAlbum.id, 
          },
        });
      }
    }
  }



console.log('Álbumes y canciones agregados a la base ');
} catch (error) {
console.error('Error al insertar álbumes y canciones en la base ', error);
} finally {
await prisma.$disconnect();
}
}


export const albumesDelete = async () => {
  try {
    
    await prisma.song.deleteMany();
    await prisma.album.deleteMany();

    
  } catch (error) {
    console.error('Error al insertar álbumes y canciones en la base ', error);
  } finally {
    await prisma.$disconnect();
  }
};