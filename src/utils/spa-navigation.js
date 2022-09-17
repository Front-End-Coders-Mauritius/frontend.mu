import { getPageContent, onLinkNavigate, getLink } from '../utils/utils.js';

const homePath = '/';
const catsPath = `${homePath}meetup/`;

function getNavigationType(fromPath, toPath) {
  if (fromPath.startsWith(catsPath) && toPath === homePath) {
    return 'cat-page-to-home';
  }
  
  if (fromPath === homePath && toPath.startsWith(catsPath)) {
    return 'home-to-cat-page';
  }
  
  return 'other';
}


onLinkNavigate(async ({ fromPath, toPath }) => {
  const navigationType = getNavigationType(fromPath, toPath);
  const content = await getPageContent(toPath);
  const transition = document.createDocumentTransition();
  
  let targetThumbnail;
  
  if (navigationType === 'home-to-cat-page') {
    targetThumbnail = getLink(toPath).querySelector('img');
    targetThumbnail.style.pageTransitionTag = 'banner-img';
  }
  
  transition.start(() => {
    document.body.innerHTML = content;
    
    if (navigationType === 'cat-page-to-home') {
      targetThumbnail = getLink(fromPath).querySelector('img');
      targetThumbnail.style.pageTransitionTag = 'banner-img';
    }
  }).then(() => {
    // Clear the temporary tag
    if (targetThumbnail) targetThumbnail.style.pageTransitionTag = '';
  });
});
