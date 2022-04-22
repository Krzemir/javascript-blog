'use strict';
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tagCloud-link').innerHTML),
  authorListLink: Handlebars.compile(document.querySelector('#template-authorList-link').innerHTML),
};

const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagListSelector: '.tags.list',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size',
  authorsListSelector: '.authors.list'
};

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /* [DONE]add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* [DONE]get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  /* [DONE]find the correct article using the selector (value of 'href' attribute) */
  const selectedArticle = document.querySelector(articleSelector);
  /* [DONE]add class 'active' to the correct article */
  selectedArticle.classList.add('active');
};
//------ Generate title links
function generateTitleLinks(customSelector = ''){
  /* remove contents of titleList */
  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';
  /* find all the articles and save them to variable: articles */
  const articles = document.querySelectorAll(opts.articleSelector + customSelector);
  let html = '';
  for(let article of articles){
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    /* insert link into html variable */
    html = html + linkHTML;
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

//----- Generate tags
function calculateTagsParams(tags){
  const params = {max: 0,
    min: 999999};
  for(let tag in tags){
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return (params);
}
function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.cloudClassCount - 1) +1);
  return (opts.cloudClassPrefix + classNumber);
  
}
function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* DONE find all articles */
  const articles = document.querySelectorAll('.post');
  /* DONE START LOOP: for every article: */
  for (let article of articles){
    /* DONE find tags wrapper */
    const tagList = article.querySelector(opts.articleTagsSelector);
    /* DONE make html variable with empty string */
    let html = '';
    /* DONE get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* DONE split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* DONE START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* DONE generate HTML of the link */
      // const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      const linkHTMLData = {id: tag, tag: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      /* DONE add generated code to html variable */
      html = html + ' ' + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]){
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    /* DONE insert HTML of all the links into the tags wrapper */
    tagList.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opts.tagListSelector);
  const tagsParams = calculateTagsParams(allTags);

  /* [NEW] create variable for all links HTML code */
  //let allTagsHTML = '';
  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    /* allTagsHTML += '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag +  '</a></li>'; */
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });

    /* [NEW] END LOOP: for each tag in allTags: */
  }
  /*[NEW] add HTML from allTagsHTML to tagList */
  // tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}
generateTags();


//------------------------Tag click hanlder
function tagClickHandler(event){
  /* DONE prevent default action for this event */
  event.preventDefault();
  /* DONE make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* DONE make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* DONE make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* DONE find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  /* DONE START LOOP: for each active tag link */
  for(let activeTagLink of activeTags){
    /* DONE remove class active */
    activeTagLink.classList.remove('.active');
  /* DONE END LOOP: for each active tag link */
  }
  /* DONE find all tag links with "href" attribute equal to the "href" constant */
  const allTagsHref = document.querySelectorAll('a[href="' + href + '"]');
  /* DONE START LOOP: for each found tag link */
  for(let tagHref of allTagsHref){
    /* add class active */
    tagHref.classList.add('.active');
  /* DONE END LOOP: for each found tag link */
  }
  /* DONE execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}
function addClickListenersToTags(){
  /* find all links to tags */
  const allTagLinks = document.querySelectorAll('.tags a, .post-tags a');
  /* START LOOP: for each link */
  for (let tagLink of allTagLinks){
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}
addClickListenersToTags();

//--------------- Generate authors---------
function generateAuthors(){
  /* [NEW] create a new variable allAuthors with an empty object */ //DONE
  //let allAuthorsHTML = [];
  const allAuthorsData = {};

  //find all articles - DONE
  const articles = document.querySelectorAll('.post');
  //start loop - for every article - DONE
  for (let article of articles){
    //find author wrapper - DONE
    const authorWrapper = article.querySelector(opts.articleAuthorSelector);
    //make html variable for every string - DONE
    let html = '';
    //get author from data-author attr - DONE
    const articleAuthor = article.getAttribute('data-author');
    //for author generate html of the link - DONE

    //const linkHTML = 'autor: <a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
    const linkHTMLData = {id: articleAuthor, author: articleAuthor};
    const linkHTML = templates.authorLink(linkHTMLData);

   

   // const authorListLinkHTML = '<li><a href="#author-' + articleAuthor + '">' + articleAuthor + '</a></li>';
    //add code to html variable - DONE
    html = linkHTML;

    /* [NEW] check if this link is NOT already in allAurhors */
 /*   allAuthorsData.authors.push({
      author: articleAuthor,
    }) */

   /*  if(allAuthorsHTML.indexOf(authorListLinkHTML) == -1){
      /* [NEW] add generated code to allAuthors array */
    /*   allAuthorsHTML.push(authorListLinkHTML);
    } */

    if(!allAuthorsData[articleAuthor]){
      /* [NEW] add generated code to allTags array */
      allAuthorsData[articleAuthor] = true;
    }

    //insert html to all the links into the author wrapper - DONE
    authorWrapper.innerHTML = html;
  //end loop for efery article
  }
  /* [NEW] find list of authors in right column */
  const authorsList = document.querySelector(opts.authorsListSelector);
  /* [NEW] add html from allAuthors to authorsList */

 // authorsList.innerHTML = allAuthorsHTML.join(' ');

  authorsList.innerHTML = templates.authorListLink({authors: allAuthorsData});
}
generateAuthors();

//---------Author click handler
function authorClickHandler(event){
  //prevent deafault action fot this event DONE
  event.preventDefault();
  //make a new constant named "clckedElement and give it the value of this" DONE
  const clickedElement = this;
  //make a new constant "href" and read the attribute "href" of the clicked element DONE
  const href = clickedElement.getAttribute('href');
  //make a new costant "author" and extract author from the "href" constant DONE
  const author = href.replace('#author-', '');
  //find all author links with class active - DONE
  const activeAuthorLinks = document.querySelectorAll('a.active [href^="#author-"]');
  // start loop: for each active author link - DONE
  for (let activeAuthorLink of activeAuthorLinks){
    // remove class active - DONE
    activeAuthorLink.classList.remove('.active');
  //end loop for each active author link - DONE
  }
  //find all author links with "href" attribude equal to "href" constant - DONE
  const allAuthorHrefs = document.querySelectorAll('a[href="' + href + '"]');
  //start loop: for each found author link
  for(let authorHref of allAuthorHrefs){
    //add class active
    authorHref.classList.add('.active');
    //end loop
  }
  //execute function with author selector as argument
  generateTitleLinks('[data-author="' + author + '"]');
}
//-------- Click Listeners to Authors
function addClickListenersToAuthors () {
  // find all links to authors
  const allAuthorLinks = document.querySelectorAll('.post-author a, .authors a');
  // start loop for each link
  for(let authorLink of allAuthorLinks){
    //add authorClickHandler as event listener for that ink
    authorLink.addEventListener('click', authorClickHandler);
  // end loop for each link
  }
}
addClickListenersToAuthors();