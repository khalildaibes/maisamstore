import sanityClient from "@sanity/client";
import ImageUrlBuilder from '@sanity/image-url'; 

export const client = sanityClient({ 
    projectId: 'qskg7t5g', 
    dataset: 'prod', 
    apiVersion: '2022-03-10', 
    useCdn: 'true', 
    token: 'skCJlCOeDYq8vRJGwYN9NqRYpjtM1LGB7vkiDT8EPUhz3pQGcobBuH8zua8D4GcekMLX6dninshQtFtOv'
}); 

const builder = ImageUrlBuilder(client); 


export const urlFor = (source) => builder.image(source);
export const getUrlFromId = (ref) => {
    // Example ref: file-207fd9951e759130053d37cf0a558ffe84ddd1c9-mp3
    // We don't need the first part, unless we're using the same function for files and images
    const [_file, id, extension] = ref.asset._ref.split('-');
    return `https://cdn.sanity.io/files/qskg7t5g/prod/${id}.${extension}`
  }
  