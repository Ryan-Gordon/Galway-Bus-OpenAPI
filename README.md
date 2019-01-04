# Galway-Bus-OpenAPI
The Galway Bus OpenAPI is a RESTful API providing travel information on Bus Eireann services in Ireland, with a focus on Galway City.
The project was built with the desire to make it easier to access information about bus services in the city. 

API follows a Design-First approach, firstly building how the route will look, how its return info will look, the format of parameters, etc until the entire design of the API is fleshed out. This approach lowers the barrier to entry for API development and means Business Analysts, QA's and Project Managers can have both more involvement in the development and more insight into what the end result will look like.


# Update 04/01/19:
This project was started last year intending to give an OpenAPI for the Bus service with support for some of the newer technology such as Docker. 
Since then, the original developer @appsandwich has updated his repo with new features including the new API endpoints. 

With this in mind, you should [check out his repo](https://github.com/appsandwich/galwaybus) for a nice working project with more features.


# Installation 

## Prerequisites
In order to build and run the project locally you will need the following installed :  

1. [NodeJS >= 8.0.0](https://nodejs.org/)
2. [Yarn](https://yarnpkg.com/)

## Quickstart

Development can be performed locally as follows:

```$bash

yarn

yarn run dev

```

# Contributors 
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat)](#contributors)
This project follows the
[all-contributors](https://github.com/kentcdodds/all-contributors)
specification. Contributions of any kind are welcome!

A list of contributors to this project
([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/11082710?v=4" width="100px;"/><br /><sub><b>Ryan Gordon</b></sub>](https://github.com/Ryan-Gordon)<br />[📝](#blog-Ryan-Gordon "Blogposts") [🐛](https://github.com/Ryan-Gordon/Galway-Bus-OpenAPI/issues?q=author%3ARyan-Gordon "Bug reports") [💻](https://github.com/Ryan-Gordon/Galway-Bus-OpenAPI/commits?author=Ryan-Gordon "Code") [🎨](#design-Ryan-Gordon "Design") [📖](https://github.com/Ryan-Gordon/Galway-Bus-OpenAPI/commits?author=Ryan-Gordon "Documentation") [👀](#review-Ryan-Gordon "Reviewed Pull Requests") [⚠️](https://github.com/Ryan-Gordon/Galway-Bus-OpenAPI/commits?author=Ryan-Gordon "Tests") [🔧](#tool-Ryan-Gordon "Tools") [✅](#tutorial-Ryan-Gordon "Tutorials") | [<img src="https://avatars2.githubusercontent.com/u/496767?v=4" width="100px;"/><br /><sub><b>Vinny Coyne</b></sub>](http://www.vinnycoyne.com)<br />[🎨](#design-appsandwich "Design") [💡](#example-appsandwich "Examples") [🤔](#ideas-appsandwich "Ideas, Planning, & Feedback") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->


# Acknowledgements  

The idea for this project came from another repo I found on Github. [galwaybus, by @appsandwich](https://github.com/appsandwich/galwaybus) is a project with aims of providing a simple API to access Galway bus info, returning it in a valid JSON format.  
This project was born from that project and borrows ideas and practices from it. The aim of this project was to develop a Typescript implementation of the Galway Bus API, adopting the OpenAPI specification and using modern practices like async/await.

If you are interested in seeing a Javascript implementation, take a look at [galwaybus, by @appsandwich](https://github.com/appsandwich/galwaybus)


