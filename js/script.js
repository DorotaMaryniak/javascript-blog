'use strict';
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagArticleLink: Handlebars.compile(document.querySelector('#template-tagArticle-link').innerHTML),
  authorArticleLink: Handlebars.compile(document.querySelector('#template-authorArticle-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tagCloud-link').innerHTML),
  authorSidebarLink: Handlebars.compile(document.querySelector('#template-authorSidebar-link').innerHTML)
};

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
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.list.authors';

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
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

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

function calculateTagsParams(tags){
  const params = {max: 0, min: 999999};
  for(let tag in tags){
    console.log(tag+'is used' + tags[tag] + 'times');

    if(tags[tag]>params.max){
      params.max=tags[tag];
    }

    if(tags[tag]<params.min){
      params.min=tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params)
{ const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  return optCloudClassPrefix + classNumber;


}

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
      const linkHTMLData = {tag:tag};
      const linkHTML = templates.tagArticleLink(linkHTMLData);
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
        allTags[tag]++;
      }

    /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */
    tagsList.innerHTML = html;

  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  /* [NEW] create variable for all links HTML code */
  const allTagsData = {tags:[]};

  /* [NEW] create START LOOP: for each tag in allTags*/
  for (let tag in allTags){
    /*[NEW] generate code of a link and add it to allTagshtml*/
    // const tagLinkHTML = '<li><a href="#tag-' + tag + '" class="'+ calculateTagClass(allTags[tag], tagsParams) + '">' + tag +  '</a></li>';
    // allTagsHTML += tagLinkHTML;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)

    });
    console.log('obiekt z tagami', allTagsData);
    /* END LOOP: for each tag in allTags */
  }
  /*[NEW] add html from allTagsHTML to taglist*/
  tagList.innerHTML=templates.tagCloudLink(allTagsData);
  console.log('allTagsData',allTagsData);
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
  const links = document.querySelectorAll('a[href^="#tag-"]');
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
  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};
  console.log('Empty author object:', allAuthors);
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
    const linkHTMLData = {author: articleAuthor };
    const linkHTML = templates.authorArticleLink(linkHTMLData);

    /* [NEW] check if articleAuthor is NOT already in allAuthors */
    if(!allAuthors.hasOwnProperty(articleAuthor)){
      /* [NEW] add articleAuthor to allAuthors object */
      allAuthors[articleAuthor]=1;
    }
    else{
      allAuthors[articleAuthor]++;
      console.log(allAuthors);
    }

    /* insert HTML of all the links into the paragraph */
    authorParagraph.innerHTML = linkHTML;
    /* END LOOP: for every article: */

  }
  /* [NEW] find list of tags in right column */
  const authorsList = document.querySelector( optAuthorsListSelector);
  console.log(authorsList);

  /* [NEW] create variable for all authors HTML code */
  const allAuthorsData = {authors: []};
  console.log('Pusty obiekt autorzy', allAuthorsData);

  /* [NEW] create START LOOP: for each author in allAuthors*/
  for (let articleAuthor in allAuthors){
    /*[NEW] generate code of a link and add it to allTagshtml*/
    //const authorLinkHTML= '<li><a href="#author-' + articleAuthor +'">' + articleAuthor + '(' + allAuthors[articleAuthor] + ')</a></li>';
    // allAuthorsHTML += authorLinkHTML;
    allAuthorsData.authors.push({
      author: articleAuthor,
      count:allAuthors[articleAuthor]
    }) ;
    console.log('Obiekty z autorami', allAuthorsData);
    /* END LOOP: for each author in allAuthors */
  }
  /*[NEW] add html from allAuthorsHTML to authorsList*/
  authorsList.innerHTML=templates.authorSidebarLink(allAuthorsData);

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
  const links = document.querySelectorAll('a[href^="#author-"]');
  console.log('Links for authors',links);

  /* START LOOP: for each link */
  for(let link of links){
    /* add authorClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);

    /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();


