/**
 *  Root element
 */
let ROOT = get("root");

/**
 * Render the page requested
 * @param url
 */
function render(url) {

    /**
     * Get request keyword from url
     * @type {string}
     */
    const request = url.split('/')[0];

    get("loading-status").update("Organizando as informações...");

    const routes = {

        /**
         * Home
         */
        '': function () {
            /**
             * App Page element
             * @type {Element}
             */
            let page = new Element({
                properties: {
                    id: "app",
                    className: ""
                }
            });

            /**
             *  Page Header
             */
            new Element({
                type: "header",
                properties: {
                    className: "app-header"
                },
                content: [
                    new Element({
                        type: "a",
                        properties: {
                            href:"https://www.objective.com.br/",
                            target:"_blank"
                            }
                    }), 
                        new Element({
                            type:"img",
                                properties: {
                                    src: "img/logo-obj.png",
                                    alt:"Logo Objective Solutions",
                                }
                            }),
                    new Element({
                        type: "h1",
                        content: "Busca Herói Marvel",
                        properties: {
                            className: "app-title"
                        }
                    }),
                    new Element({
                        type: "h4",
                        content: "CB",
                        properties: {
                            className: "icon-cb"
                        }
                    }),  
                    new Element({
                        type: "h2",
                        content: "Teste front-end",
                        properties: {
                            className: "app-subtitle hide-on-mobile"
                        }
                    }),
                    new Element({
                        type: "h3",
                        content: "Luiz Felipe Apolinário",
                        properties: {
                            className: "app-developer"
                        }
                    }),               
                ]
            }, page);

            /**
             *  Detail
             */
            new Element({
                properties: {
                    className: "app-line"
                },
                content: new Element
            }, page);

            /**
             *  Search box
             */
            new Element({
                type: "section",
                properties: {
                    id: "search-container",
                    placeholder: "Pesquisar"
                },
                content: [
                    new Element({
                        type: "label",
                        content: "Nome do Personagem",
                        properties: {
                            htmlFor: "search-box",
                            className: "app-search-label"
                        }
                    }),
                    new Element({
                        type: "input",
                        properties: {
                            id: "search-box",
                            className: "app-search-box",
                            title: "Digite o nome de um herói da Marvel",
                            placeholder: "ex. Spider-Man",
                            oninput: function(){
                                filterList();
                            }
                        }
                    }),
                ]
            }, page);

            /**
             *  Heroes List
             */
            new Element({
                type: "section",
                properties: {
                    className: "app-hero-list",
                },
                content: [
                    new Element({
                        properties: {
                            className: "app-hero-list-header",
                        },
                        content: [
                            new Element({
                                content: "Nome"
                            }),
                            new Element({
                                content: "Séries",
                                properties: {
                                    className: "hide-on-mobile"
                                }
                            }),
                            new Element({
                                content: "Eventos",
                                properties: {
                                    className: "hide-on-mobile"
                                }
                            })
                        ]
                    }),
                    new Element({
                        properties: {
                            id: "hero-list",
                            className: "app-hero-list-rows",
                        },
                        content: goPage(1, HERO_LIST, true)
                    }),
                ]
            }, page);

            new Element({
                properties: {
                    id: "pagination-container",
                    className: "app-pagination-container row-4",
                },
                type: "section",
                content: [
                    new Element({
                        properties: {
                            className: "app-pagination"
                        },
                        content: [
                            new Element({
                                type: "span",
                                content: "&#9664;",
                                properties: {
                                    className: "disabled",
                                    id: "app-pagination-prev",
                                    onclick: function () {
                                        goPage(prevPage());
                                    }
                                }
                            }),
                            new Element({
                                type: "ul",
                                properties: {
                                    id: "pagination-list"
                                },
                                content: [
                                    new Element({
                                        type: "li",
                                        content: "1",
                                        properties: {
                                            className: "app-pagination-page active",
                                            onclick: function () {
                                                goPage(1);
                                            }
                                        }
                                    })
                                ]
                            }),
                            new Element({
                                type: "span",
                                content: "&#9654;",
                                properties: {
                                    className: "disabled",
                                    id: "app-pagination-next",
                                    onclick: function () {
                                        goPage(nextPage());
                                    }
                                }
                            })
                        ]
                    })
                ]
            }, page);

            new Element({
                properties: {
                    id: "footer",
                },
                type: "footer",
                content: [
                    new Element({
                        type: "span",
                        properties: {
                            id: "copyright"
                        },
                        content: HERO_DATA.copyright
                })
                ]
            }, page);

            ROOT.update(page, function(){
                trigger("list-updated");
            });
        },

        /**
         * Detail page
         */
        '#hero': function () {

            /**
             * App Page element
             * @type {Element}
             */
            let page = new Element({
                properties: {
                    id: "app",
                    className: "detail"
                }
            });

            /**
             * Get the hero name
             * @type {string}
             */
            let idHero = url.split('#hero/')[1].trim();

            let hero = HERO_LIST.find(function (h) {
                if(parseInt(h.id) === parseInt(idHero)){
                    return h;
                }
            });

            let series = [
                new Element({
                    properties: {
                        className: "detail-block"
                    },
                    content: [
                        new Element({
                            type: "header",
                            properties: {
                                className: "detail-block-header"
                            },
                            content: "Não há dados para exibir nesta categoria."
                        })
                    ]
                })
            ];

            let events = [
                new Element({
                    properties: {
                        className: "detail-block"
                    },
                    content: [
                        new Element({
                            type: "header",
                            properties: {
                                className: "detail-block-header"
                            },
                            content: "Não há dados para exibir nesta categoria."
                        })
                    ]
                })
            ];

            if(hero.series.returned > 0){

                /**
                 *  Fetch (more) information about series
                 */
                series = hero.series.items.map(function(s){
                    idSerie = "detail-serie-" + s.resourceURI.toString().split("/").slice(-1).toString().trim();

                    setTimeout(function(){
                        fetch(s.resourceURI.toString().replace("http://", "https://") + "?apikey=745b367fe628aa6624d02c6613080f94").then(r => r.json()).then(function(json){
                            let data = json.data.results[0];
                            get("detail-serie-" + data.id).update(new Element({
                                properties: {
                                    className: "detail-card"
                                },
                                content: [
                                    new Element({
                                        properties: {
                                            className: "detail-card-description"
                                        },
                                        content: data.description || "Sem descrição."
                                    }),
                                    new Element({
                                        type: "a",
                                        properties: {
                                            className: "detail-card-link",
                                            href: data.urls[0].url,
                                            target: "_blank",
                                            title: "Veja mais no site da MARVEL"
                                        },
                                        content: "&#9654; Veja mais em MARVEL.com"
                                    }),
                                    new Element({
                                        properties: {
                                            className: "detail-card-properties"
                                        },
                                        content: [
                                            new Element({
                                                content: [
                                                    "Creators:",
                                                    data.creators.items.map(function(c){
                                                        return c.name;
                                                    }).join(", ")
                                                ].join(" ").trim()
                                            })
                                        ]
                                    }),
                                ]
                            }));
                        }).catch(function(err){
                            get(idSerie).update("Desculpe, não foi possível obter dados da MARVEL.");
                            console.error(err);
                        });
                    }, 300);

                    return new Element({
                        properties: {
                            className: "detail-block"
                        },
                        content: [
                            new Element({
                                type: "header",
                                properties: {
                                    className: "detail-block-header"
                                },
                                content: s.name
                            }),
                            new Element({
                                type: "section",
                                properties: {
                                    className: "detail-block-content",
                                    id: idSerie,
                                    style: {
                                        textAlign: "center"
                                    }
                                },
                                content: [
                                    new Element({
                                        className: "detail-loading",
                                        type: "img",
                                        properties: {
                                            src: "img/loading.gif",
                                            alt: "Obtendo dados...",
                                            height: "40",
                                            width: "40"
                                        }
                                    }),
                                ]
                            })
                        ]
                    });
                });
            }

            if(hero.events.returned > 0){

                /**
                 *  Fetch (more) information about events
                 */
                events = hero.events.items.map(function(s){
                    idEvent = "detail-event-" + s.resourceURI.toString().split("/").slice(-1).toString().trim();

                    setTimeout(function(){
                        fetch(s.resourceURI.toString().replace("http://", "https://") + "?apikey=745b367fe628aa6624d02c6613080f94").then(r => r.json()).then(function(json){
                            let data = json.data.results[0];
                            console.log(data);
                            get("detail-event-" + data.id).update(new Element({
                                properties: {
                                    className: "detail-card"
                                },
                                content: [
                                    new Element({
                                        properties: {
                                            className: "detail-card-description"
                                        },
                                        content: data.description || "Sem descrição."
                                    }),
                                    new Element({
                                        properties: {
                                            className: "detail-card-properties"
                                        },
                                        content: [
                                            new Element({
                                                content: [
                                                    "Criadores:",
                                                    data.creators.items.map(function(c){
                                                        return c.name;
                                                    }).join(", ")
                                                ].join(" ").trim()
                                            })
                                        ]
                                    }),
                                ]
                            }));
                        }).catch(function(err){
                            get(idSerie).update("Desculpe, não foi possível obter dados da MARVEL.");
                            console.error(err);
                        });
                    }, 300);

                    return new Element({
                        properties: {
                            className: "detail-block"
                        },
                        content: [
                            new Element({
                                type: "header",
                                properties: {
                                    className: "detail-block-header"
                                },
                                content: s.name
                            }),
                            new Element({
                                type: "section",
                                properties: {
                                    className: "detail-block-content",
                                    id: idEvent
                                },
                                content: [
                                    new Element({
                                        className: "detail-loading",
                                        type: "img",
                                        properties: {
                                            src: "img/loading.gif",
                                            alt: "Obtendo dados...",
                                            height: "40",
                                            width: "40",
                                            style: {
                                                display: "block",
                                                margin: "10px auto",
                                            }
                                        }
                                    }),
                                ]
                            })
                        ]
                    });
                });
            }

            /**
             *  Back home link
             */
            new Element({
                type: "a",
                properties: {
                    onclick: function(){
                        window.location.hash = "";
                    },
                    id: "back-home",
                    title: "Voltar à busca"
                },
                content: "&#9664;"
            }, page);

            /**
             *  Page Header
             */
            new Element({
                type: "header",
                properties: {
                    id: "detail-header",
                    className: "app-header"
                },
                content: [
                    new Element({
                        content: [
                            new Element({
                                id: "detail-img",
                                type: "img",
                                properties: {
                                    src: (['path', 'extension'].map(p => hero.thumbnail[p])).join(".").replace("http://", "https://"),
                                    alt: hero.name,
                                    height: "180",
                                    width: "180"
                                }
                            }),
                            new Element({
                                type: "h1",
                                content: hero.name,
                                properties: {
                                    className: "app-title"
                                }
                            }),
                        ]
                    }),
                    new Element({
                        type: "h3",
                        content: HERO_DATA.copyright,
                        properties: {
                            className: "detail-logo hide-on-mobile"
                        }
                    })
                ]
            }, page);

            new Element({
                properties: {
                    id: "detail-content",
                },
                type: "section",
                content: [
                    new Element({
                        type: "section",
                        properties: {
                            className: "detail-content-section"
                        },
                        content: [
                            new Element({
                                type: "header",
                                content: "Séries"
                            }),
                            new Element({
                                type: "section",
                                content: series
                            })
                        ]
                    }),
                    new Element({
                        type: "section",
                        properties: {
                            className: "detail-content-section"
                        },
                        content: [
                            new Element({
                                type: "header",
                                content: "Eventos"
                            }),
                            new Element({
                                type: "section",
                                content: events
                            })
                        ]
                    })
                ]
            }, page);

            /**
             *  Footer
             */
            new Element({
                properties:{
                    id: "detail-footer"
                },
                content: [
                    new Element({
                        content: HERO_DATA.attributionText
                    }),
                    new Element({
                        content: "LUIZ FELIPE APOLINÁRIO"
                    })
                ]
            }, page);

            ROOT.update(page);
        }
    };

    /**
     *  Load the page requested
     */
    if (routes[request]) {
        get("loading-status").addClass("hidden");
        routes[request]();
    }
    /**
     *  If the request is not registered, load main page
     */
    else {
        window.location.hash = "";
    }
}

/**
 * Displays error page
 * @param message
 */
function errorPage(message) {
    ROOT.innerHTML = message + (window.location.hash !== "")? " (" + window.location.hash + ")" : "";
}

/**
 *  Filter results
 */
function filterList() {
    const search = new RegExp(get("search-box").value, "i");
    let oldList = HERO_LIST;
    HERO_LIST = HERO_DATA.data["results"].filter(function(hero){
        if(search.test(hero.name)){
            return hero;
        }
    });

    if(oldList !== HERO_LIST){
        get("hero-list").update(goPage(1, HERO_LIST, true));
    }
}

/**
 * Return the number of previous page
 * @returns {number}
 */
function prevPage() {
    if (CURRENT_PAGE > 1) {
        CURRENT_PAGE -= 1;
    }
    return CURRENT_PAGE;
}

/**
 * Return the number of next page
 * @returns {number}
 */
function nextPage() {
    let max = select(".app-pagination-page").length;
    if (CURRENT_PAGE < max) {
        CURRENT_PAGE += 1;
    }
    return CURRENT_PAGE;
}

/**
 * Set global pagination to page number 'p'
 * @param p
 * @returns {number}
 */
function setPage(p) {
    let pages = select(".app-pagination-page");

    // console.log("setPage(%s): pages.length = %s", p, pages.length);

    if (pages.length > 0){
        pages.removeClass("active")[(p - 1)].addClass("active");

        if(p === 1) {
            get("app-pagination-prev").addClass("disabled");
            get("app-pagination-next").addClass("disabled");
        } else {
            get("app-pagination-prev").removeClass("disabled");
        }
        if(p >= pages.length) {
            get("app-pagination-next").addClass("disabled");
        } else {
            get("app-pagination-next").removeClass("disabled");
        }

        if((pages.length > SHOW_ITEMS) && (p > 1) && (p < pages.length - 1)) {
            for(let i = 0; i < pages.length; i++){
                if((i >= (p - 2)) && (i <= (p + 1))){
                    // console.log("i: %s | p: %s | visible", i, p);
                    pages[i].addClass("mobile-visible");
                } else {
                    // console.log("i: %s | p: %s", i, p);
                    pages[i].removeClass("mobile-visible");
                }
            }
        }
    }
    CURRENT_PAGE = p;
    return p;
}

/**
 * Build pagination
 * @returns {Array}
 */
function buildPagination() {
    let result = [];


    for (let i = 0; i < HERO_LIST.length; i += SHOW_ITEMS){
        let j = (i/SHOW_ITEMS) + 1;
        result.push(new Element({
            type: "li",
            content: j.toString(),
            properties: {
                className: [
                    "app-pagination-page",
                    ((j === CURRENT_PAGE)? "active" : ""),
                    ((j <= SHOW_ITEMS)? "mobile-visible" : "")
                ].join(" ").trim(),
                onclick: function () {
                    goPage(j);
                }
            }
        }));
    }

    get("pagination-list").update(result);

    return result;
}

/**
 *
 * @param name
 */
function renderHeroPage(name) {
    ROOT.innerHTML = "Hero " + name;
}

/**
 * Build rows for Heros based on its Objects of data
 * @param [page] {int}
 * @param [heroDataResults] {Array}
 * @param [updatePagination] {boolean}
 * @returns {Array}
 */
function goPage(page, heroDataResults, updatePagination) {

    if(typeof page === 'undefined'){
        page = 1;
    }

    setPage(page);

    if(typeof heroDataResults === 'undefined') {
        heroDataResults = HERO_LIST;
    } else if(!(heroDataResults instanceof Array)){
        heroDataResults = [];
    }

    let sliceFrom = (page - 1) * SHOW_ITEMS;
    let sliceArr = heroDataResults.slice(sliceFrom, (sliceFrom + SHOW_ITEMS));

    let visibleRows = sliceArr.length;

    let result = sliceArr.map(function (heroData) {
        let series = [], events = [];

        if (heroData.series.returned > 0) {
            let count = 0, max = 3;
            heroData.series.items.forEach(function (s) {
                if (++count <= max) {
                    if (count === max) {
                        s += " - e mais " + (heroData.series.returned - count);
                    }
                    series.push(
                        new Element({
                            content: s.name,
                        })
                    );
                } else {
                    return false;
                }
            });
        } else {
            series = new Element({
                content: "Não foram encontradas séries com este personagem."
            })
        }

        if (heroData.events.returned > 0) {
            let count = 0, max = 3;
            heroData.events.items.forEach(function (e) {
                if (++count <= max) {
                    if (count === max) {
                        e += " - e mais " + (heroData.events.returned - count);
                    }
                    events.push(
                        new Element({
                            content: e.name,
                        })
                    );
                } else {
                    return false;
                }
            });
        } else {
            events = new Element({
                content: "Não foram encontrados eventos com este personagem."
            })
        }

        return new Element({
            properties: {
                className: "app-hero-list-row",
                id: heroData.id,
                onclick: function() {
                    window.location.hash = "#hero/" + heroData.id;
                }
            },
            content: [
                /**
                 * First Column
                 */
                new Element({
                    content: [
                        new Element({
                            content: new Element({
                                type: "img",
                                properties: {
                                    src: (['path', 'extension'].map(p => heroData.thumbnail[p])).join(".").replace("http://", "https://"),
                                    alt: heroData.name,
                                    height: "58",
                                    width: "58"
                                }
                            })
                        }),
                        new Element({
                            type: "div",
                            content: heroData.name
                        })
                    ]
                }),
                /**
                 * Series Column
                 */
                new Element({
                    content: series,
                    properties: {
                        className: "hide-on-mobile"
                    }
                }),
                /**
                 * Events Column
                 */
                new Element({
                    content: events,
                    properties: {
                        className: "hide-on-mobile"
                    }
                })
            ]
        });
    });

    if(updatePagination === true) {
        trigger("list-updated");
    } else {
        get("hero-list").update(result);
    }

    get("pagination-container").className = "app-pagination-container row-" + visibleRows;

    return result;
}