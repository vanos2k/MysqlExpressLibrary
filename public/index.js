function starsCounter (length) {
    let stars = '';

    for (let j = 0; j< 5; j++) {
        if (j < Math.round(length))
            stars = stars + `<span class=\"active\"></span>`;
        else {
            stars = stars + '<span></span>';
        }
    }
    return stars
}

document.querySelectorAll('.date').forEach(node => {
    node.textContent = `${toDate(node.textContent)}`;
});

function toDate (date) {
    return new Intl.DateTimeFormat('en-En', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(new Date(date));
}


// book finder by user query
const $finder = document.querySelector('#help-bar');
if ($finder) {
    $finder.addEventListener('click', event => {
        if (event.target.classList.contains('finder')) {
            const finderValue = document.getElementById('finderInfo').value.trim();
            const csrf = event.target.dataset.csrf;
            const status = event.target.dataset.status;
            const username = event.target.dataset.username;

            fetch(`/reader/${username}/find?value=${finderValue}&status=${status}`, {
                method: 'post',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            }).then(res => {
                return res.json();
            }).then(books => {
                let returnHtml = '';
                if (books.length > 0) {
                    let totalStarsBar = '';
                    let userRatingBar = '';
                    if (+status === 2) {
                        for (let i = 0, length = books.length; i < length; i++) {

                            totalStarsBar = starsCounter(books[i].totalRating);
                            userRatingBar = starsCounter(books[i].rate);

                            returnHtml += `
                                <div class="card mt-2 mb-5">
                                    <div class="card-body">
                                        <div class="rating-card-image">
                                            <img height="130" width="auto" src="${books[i].image}" alt="${books[i].title}">
                                        </div>
                                        <div class="rating-card-content">
                                            <p><a class="text-primary" href="/books/${books[i].bSlug}">${books[i].title}</a></p>
                                            <p><a class="text-info" href="/author/${books[i].aSlug}">${books[i].aName} ${books[i].aSurname}</a></p>
                                        </div>
                                        
                                         <div class="rating-result">
                                            <b>${username} mark: ${books[i].rate}</b>
                                            ${userRatingBar}
                                            <b class="">General ${books[i].totalRating}</b>
                                            ${totalStarsBar}
                                        </div>
                                        <div class="rating-result">

                                        </div>
                        
                                        <div class="mt-3">
                                            <p>${books[i].description}</p>
                                        </div>
                        
                                    </div>
                                </div>
                          `;
                        }
                    } else {
                        for (let i = 0, length = books.length; i < length; i++) {
                            totalStarsBar = starsCounter(books[i].totalRating);

                            returnHtml += `
                                <div class="card mt-2 mb-5">
                                    <div class="card-body">
                                        <div class="rating-card-image">
                                            <img height="130" width="auto" src="${books[i].image}" alt="${books[i].title}">
                                        </div>
                                        <div class="rating-card-content">
                                            <p><a class="text-primary" href="/books/${books[i].bSlug}">${books[i].title}</a></p>
                                            <p><a class="text-info" href="/author/${books[i].aSlug}">${books[i].aName} ${books[i].aSurname}</a></p>
                                        </div>
                        
                                        <div class="rating-result">
                                            <b class="">General ${books[i].totalRating}</b>
                                            ${totalStarsBar}
                                        </div>
                        
                                        <div class="mt-3">
                                            <p>${books[i].description}</p>
                                        </div>
                        
                                    </div>
                                </div>
                          `;
                        }
                    }
                } else {
                    returnHtml = `<h3>There are no books by with this title "${finderValue}"</h3>`
                }

                document.querySelector('#books-card').innerHTML = returnHtml;
            })
        }
    });
}

function postSortSend(csrf, username, status) {
    let selectBox = document.getElementById("sort-option");
    const selectedValue = selectBox.options[selectBox.selectedIndex].value;


    fetch(`/reader/${username}/sort?sortCode=${selectedValue}&status=${status}`, {
        method: 'post',
        headers: {
            'X-XSRF-TOKEN': csrf
        }
    }).then(res => res.json())
      .then(ratings => {
          let returnHtml = '';
          let totalStarsBar;
          let userRatingBar;
          console.log(ratings);
          if (+status === 2) {
              for (let i = 0, length = ratings.length; i < length; i++) {
                  totalStarsBar = starsCounter(ratings[i].totalRating);
                  userRatingBar = starsCounter(ratings[i].rate);

                  returnHtml += `
                            <div class="card mt-2 mb-5">
                                <div class="card-body">
                                    <div class="rating-card-image">
                                        <img height="130" width="auto" src="${ratings[i].book.image}" alt="{{book.title}}">
                                    </div>
                                    <div class="rating-card-content">
                                        <p><a class="text-primary" href="/books/{{book.slug}}">${ratings[i].book.title}</a></p>
                                        <p><a class="text-info" href="/author/{{book.author.slug}}">${ratings[i].book.author.name} ${ratings[i].book.author.surname}</a></p>
                                    </div>
                
                                    <div class="rating-result">
                                        <b>${ratings[i].User.username} mark: ${ratings[i].rate}</b>
                                        ${userRatingBar}
                                        <b class="ml-4">General ${ratings[i].totalBookRating}</b>
                                        ${totalStarsBar}
                                    </div>
                
                                    <div class="mt-3">
                                        <p>${ratings[i].book.description}</p>
                                    </div>
                
                                </div>
                            </div>
                    `;
              }
          } else {
              for (let i = 0, length = ratings.length; i < length; i++) {
                  totalStarsBar = starsCounter(ratings[i].totalRating);

                  returnHtml += `
                            <div class="card mt-2 mb-5">
                                <div class="card-body">
                                    <div class="rating-card-image">
                                        <img height="130" width="auto" src="${ratings[i].book.image}" alt="{{book.title}}">
                                    </div>
                                    <div class="rating-card-content">
                                        <p><a class="text-primary" href="/books/{{book.slug}}">${ratings[i].book.title}</a></p>
                                        <p><a class="text-info" href="/author/{{book.author.slug}}">${ratings[i].book.author.name} ${ratings[i].book.author.surname}</a></p>
                                    </div>
                
                                    <div class="rating-result">
                                        <b class="ml-4">General ${ratings[i].totalBookRating}</b>
                                        ${totalStarsBar}
                                    </div>
                
                                    <div class="mt-3">
                                        <p>${ratings[i].book.description}</p>
                                    </div>
                
                                </div>
                            </div>
                    `;
              }
          }
      document.querySelector('#books-card').innerHTML = returnHtml;
      })
}