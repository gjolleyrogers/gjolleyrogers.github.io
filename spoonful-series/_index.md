---
title: A Spoonful of Hugo
description: |
  A forking fun new feature for series.
author: Garry Jolley-Rogers
show_post_thumbnail: false
show_author_byline: true
show_post_date: true
# for series listing page layout
layout: list-sidebar # list, list-sidebar, list-grid

# for list-sidebar layout
sidebar: 
  title: A Spoonful of Hugo
  author: Garry Jolley-Rogers
  description: |
    A forking fun new feature for series.
    Even this sidebar offers a ton of customizations!
    
    Check out the _index.md file in the /blog/spoonful-series
    folder to edit this content.
  text_link_label: ""
  text_link_url: ""
  show_sidebar_adunit: false # show ad container

# set up common front matter for all individual pages in series
cascade:
  layout: single-series       # for a series, do not change
  series: A Spoonful of Hugo  # name your series
  author: Garry Jolley-Rogers
  show_author_byline: true
  show_post_date: true
  sidebar:
    text_link_label: ""
    text_link_url: ""
    show_sidebar_adunit: false # show ad container
    text_series_label: "In this series" 
    text_contents_label: "On this page" 
  tags:
  - un
  categories:
  - un
---
 ** No content below YAML for the series _index. This file is a leaf bundle, and provides settings for the listing page layout and sidebar content.**