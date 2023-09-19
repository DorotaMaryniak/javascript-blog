'use strict';

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  console.log(event);

  /* [DONE]remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /*[IN PROGRESS] add class 'active' to the clicked link */
  console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.post.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector=clickedElement.getAttribute('href');
  console.log('articleSelector:', articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log('targetArticle:', targetArticle);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}



const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector ='.post-author',
  optTagsListSelector = '.tags.list';

function generateTitleLinks(customSelector=''){

  /* remove contents of titleList */
  const titleList = document.querySelector( optTitleListSelector );
  titleList.innerHTML='';

  /* for each article */
  const articles= document.querySelectorAll(optArticleSelector+customSelector);
  console.log('optArticleSelector+customSelector:',optArticleSelector+customSelector);
  console.log('Articles:', articles);
  let html='';

  for(let article of articles){

    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;


    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle+ '</span></a></li>';
    console.log(linkHTML);

    /* insert link into titleList */
    html = html + linkHTML;
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }

}

generateTitleLinks();

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  console.log('Empty object:', allTags);
  /* find all articles */
  const articles= document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for(let article of articles){

    /* find tags wrapper */
    const tagsList = article.querySelector( optArticleTagsSelector );
    console.log('tagsList:',tagsList);

    /* make html variable with empty string */
    let html ='';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags);

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);

    /* START LOOP: for each tag */
    for (let tag of articleTagsArray){
      console.log(tag);

      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      console.log(linkHTML);

      /* add generated code to html variable */
      html = html + linkHTML +'  ';
      console.log(html);

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add tag to allTags object */
        allTags[tag]=1;
      }
      else{
        allTags[tag]++
      }

    /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */
    tagsList.innerHTML = html;

  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  /* [NEW] create variable for all links HTML code */
  let allTagsHTML = '';

  /* [NEW] create START LOOP: for each tag in allTags*/
  for (let tag in allTags){
    /*[NEW] generate code of a link and add it to allTagshtml*/
    allTagsHTML+= '<li><a href="#tag-' + tag + '">' + tag + '(' + allTags[tag] + ')</a></li>';

  /* END LOOP: for each tag in allTags */
  }
  /*[NEW] add html from allTagsHTML to taglist*/
  tagList.innerHTML=allTagsHTML;

}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('Tag was clicked');

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log(href);


  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  console.log(tag);


  /* find all tag links with class active */
  const activetagLinks = document.querySelectorAll('a.active[href^="#tag-"]');



  /* START LOOP: for each active tag link */
  for(let activetagLink of activetagLinks){

    /* remove class active */
    activetagLink.classList.remove('active');

  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const hreftagLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log('Links with href',hreftagLinks);

  /* START LOOP: for each found tag link */
  for(let hreftagLink of hreftagLinks){

    /* add class active */
    hreftagLink.classList.add('active');

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const links = document.querySelectorAll('.post-tags a');
  console.log('Links for tags',links);

  /* START LOOP: for each link */
  for(let link of links){
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors (){
  /* find all articles */
  const articles= document.querySelectorAll(optArticleSelector);
  console.log('All articles',articles);
  /* START LOOP: for every article: */
  for(let article of articles){

    /* find author paragraph */
    const authorParagraph= article.querySelector(optArticleAuthorSelector);
    console.log(authorParagraph);

    /* get authors from data-autor attribute */
    const articleAuthor = article.getAttribute('data-author');
    console.log(articleAuthor);

    /* generate HTML of the link */
    const linkHTML = '<a href="#author-' + articleAuthor +'">' + articleAuthor + '</a>';
    console.log(linkHTML);

    /* insert HTML of all the links into the paragraph */
    authorParagraph.innerHTML = linkHTML;
    /* END LOOP: for every article: */

  }

}
generateAuthors();


function authorClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('Author was clicked');

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log(href);


  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');
  console.log(author);
  /* find all author links with class active */
  const activeauthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active author link */
  for(let activeauthorLink of activeauthorLinks){

    /* remove class active */
    activeauthorLink.classList.remove('active');

  /* END LOOP: for each active author link */
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  const hrefauthorLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log('Links with href',hrefauthorLinks);

  /* START LOOP: for each found author link */
  for(let hrefauthorLink of hrefauthorLinks){

    /* add class active */
    hrefauthorLink.classList.add('active');

    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with custom selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}



function addClickListenersToAuthors(){
  /* find all links to authors */
  const links = document.querySelectorAll('.post-author a');
  console.log('Links for authors',links);

  /* START LOOP: for each link */
  for(let link of links){
    /* add authorClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);

    /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();


