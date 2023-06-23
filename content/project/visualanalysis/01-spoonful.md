---
title: "sidenote"
weight: 1
subtitle: "sidenote"
excerpt: " "
weight: 5 
date: 2023-04-15
author: "Garry Jolley-Rogers"
draft: false
---

{{< here >}}

<link rel="stylesheet" href="http://unpkg.com/tachyons-negative-margins@1.0.1/css/tachyons-negative-margins.min.css" />
<div class="cf-ns nl0 nr2">
  <div class="fl-ns w-25-ns ph2">100/25</div>
  <div class="fl-ns w-50-ns ph2">100/50</div>
  <div class="fl-ns w-25-ns ph2">100/25</div>
</div>





<p class="tr">Aligned Right</p>
## does this work?

### or this?

---
 
Let's start.
 {{< sidenote >}}
  blah
{{< /sidenote >}}
## beginning


## middle

 
## end 
<head>
    <meta charset="UTF-8">

    <link rel="apple-touch-icon" type="image/png" href="https://cpwebassets.codepen.io/assets/favicon/apple-touch-icon-5ae1a0698dcc2402e9712f7d01ed509a57814f994c660df9f7a952f3060705ee.png"/>

    <meta name="apple-mobile-web-app-title" content="CodePen">

    <link rel="shortcut icon" type="image/x-icon" href="https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico"/>

    <link rel="mask-icon" type="image/x-icon" href="https://cpwebassets.codepen.io/assets/favicon/logo-pin-b4b4269c16397ad2f0f7a01bcdf513a1994f4c94b8af2f191c09eb0d601762b1.svg" color="#111"/>

    <title>CodePen - Sidebar footnotes (inspired by Grantland.com)</title>
    <link rel="canonical" href="https://codepen.io/nickbottomley/pen/nOoxgX"/>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">

    <style>
    /*
    In adjusting styles, it's important that none of the ancestor elements of .fnify-note (or whatever you choose for the note selector) have positioning other than static. The "top" property calculated by the script will position the element that far from the top of it's most recent positioned ancestor... which we want to just be the document.
    */
    * {
        box-sizing: border-box;
    }

    * :after, * :before {
        box-sizing: border-box;
    }

    html {
        padding: 0;
        margin: 1.5rem;
    }

    body {
        font-family: sans-serif;
        padding: 0;
        margin: 0;
        font-size: 1rem;
        line-height: 1.5;
    }

    p {
        margin-top: 0;
        margin-bottom: 1.5rem;
    }

    .wrapper {
        display: flex;
    }

    .content {
        flex: 1;
    }

    .sidebar {
        width: 18rem;
        margin-left: 1rem;
        padding: 1em;
        background: #ddd;
    }

    .top-box {
        width: 100%;
        height: 200px;
        background: #ccc;
        margin-bottom: 1rem;
    }

    .footnotes {
        background: #eee;
        width: 100%;
        margin: 0;
        list-style-type: none;
        -webkit-padding-start: 0;
    }

    .footnotes li {
        position: absolute;
    }

    .fnify-note {
        display: block;
        width: 16rem;
    }

    .fnify-ref {
        font-size: 0.75rem;
        line-height: 0.75rem;
        position: relative;
        top: -0.25rem;
    }

    sup {
        height: 0;
    }

    @media screen and (max-width: 700px) {
        .wrapper {
            display: block;
        }

        .content {
            display: block;
        }

        .sidebar {
            display: flex;
            flex-direction: column;
            width: 100%;
            margin: 0;
        }

        .sidebar .top-box {
            order: 2;
            margin: 1rem 0 0 0;
        }

        .sidebar .footnotes {
            order: 1;
        }

        .sidebar .footnotes li {
            position: static;
            margin-top: 0;
            margin-bottom: 1rem;
            width: 100%;
        }
    }
    </style>

    <script>
    window.console = window.console || function(t) {};
    </script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js"></script>

</head>

<body translate="no">
    <div class="wrapper">
        <div class="content">
            <h2>Footnotes like Grantland.com</h2>
            <p>
                <strong>
                    <a href="http://www.grantland.com/story/_/id/9668858/a-prime-dilemma">This article</a>
                     is an example of the stuff mentioned in the info.
                </strong>
            </p>
            <p>
                <em>UPDATE seems Grantland 3.0 includes this functionality.</em>
            </p>
            <p>
                <strong>Try resizing to see notes move according to their reference</strong>
            </p>
            <p>
                Bacon ipsum dolor sit amet tongue ribeye turkey, capicola tenderloin fatback ground
                <sup class='fnify-ref'></sup>
                <span class='fnify-note'>Here's the first footnote. It's long... very long...  long enough to overlap the next footnote.. if we keep writing  we will see how the overlap is messing things up. Blah blah blah.</span>
                 round. Ham hock venison turkey shoulder t-bone corned beef. Ribeye jerky short loin t-bone, turducken corned beef filet mignon sausage shank shoulder beef ribs. Short loin kevin drumstick pork cow leberkas, turkey pig strip steak pork loin corned beef capicola hamburger t-bone beef ribs. Pork chop
                <sup class="fnify-ref"></sup>
                <span class="fnify-note">Second footnote</span>
                venison jerky, pancetta biltong sausage sirloin pork belly boudin shoulder chuck swine.
            </p>
            <p>
                Capicola brisket ball tip, tongue doner pork chop meatloaf biltong sirloin. Salami ham tenderloin jerky bacon capicola fatback. Short loin shoulder pork biltong bacon chuck capicola drumstick pork chop jowl kevin. Strip steak turducken turkey ham hock t-bone rump bacon swine ribeye drumstick tenderloin capicola
                <sup class="fnify-ref"></sup>
                <span class="fnify-note">Third footnote</span>
                . Hamburger doner jerky, ham hock flank shank prosciutto.
            </p>
            <p>
                Short loin tenderloin meatball sirloin. Hamburger spare ribs ball tip pork loin short loin doner salami turkey ham hock chuck ribeye
                <sup class="fnify-ref"></sup>
                <span class="fnify-note">Fourth footnote. This is also a longn footnote and might overlap with following footnotes if they get close enough.</span>
                . Sausage chuck meatball kevin. Ribeye tail tongue ham hock meatball capicola, jowl ball tip shoulder rump prosciutto t-bone turkey. Pastrami spare ribs shankle flank, corned beef strip steak hamburger shank biltong tail sausage.
            </p>
            <p>
                Venison prosciutto
                <sup class="fnify-ref"></sup>
                <span class="fnify-note">Fifth footnote</span>
                 fatback tri-tip corned beef hamburger salami tail swine meatloaf boudin kielbasa pork chop cow. Tongue pig ribeye beef ribs capicola, cow ground round bresaola pork loin spare ribs kielbasa. Prosciutto rump filet mignon, beef pig shoulder pancetta salami short loin cow venison pork loin shank. Ball tip boudin tenderloin andouille
                <sup class="fnify-ref"></sup>
                <span class="fnify-note">sixth footnote</span>
                 flank sausage. Biltong ground round short ribs ball tip.
            </p>
        </div>
        <div class="sidebar">
            <div class="top-box">
                <p>
                    <strong>An ad or something.</strong>
                </p>
                <p>For better vertical rhythm, carefully adjusting the top of the footnote container so that it lines up with a line of content is key.</p>
            </div>
            <ul class="footnotes"></ul>
        </div>
    </div>
    <script src="https://cpwebassets.codepen.io/assets/common/stopExecutionOnTimeout-2c7831bb44f98c1391d6a4ffda0e1fd302503391ca806e7fcc7b9b87197aec26.js"></script>

    <script src='//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
    <script id="rendered-js">
    (function() {
        var Footnotify;

        Footnotify = {

            // if you want to use different selectors or IDs, pass an object like this to Footnotify.init()
            config: {
                link: "sup.fnify-ref",
                note: "span.fnify-note",
                holder: ".footnotes",
                refIdStem: "fnify-ref-",
                noteIdStem: "fnify-note-"
            },
            getElements: function() {
                return {
                    $links: $(this.config.link),
                    $notes: $(this.config.note),
                    $holder: $(this.config.holder)
                };
            },

            // init() will use getElements() to fill this with jQuery objects 
            // based on the values of config when init() is called.
            el: {},
            setupRefs: function(links) {
                var noteStem,
                    refStem;
                noteStem = this.config.noteIdStem;
                refStem = this.config.refIdStem;
                return links.each(function(i) {
                    return $(this).html(`[${i + 1}]`).wrap(`<a href='#${noteStem}${i + 1}'>`).attr("id", `${refStem}${i + 1}`);
                });
            },
            setupNotes: function(notes) {
                var noteStem,
                    refStem;
                noteStem = this.config.noteIdStem;
                refStem = this.config.refIdStem;
                return notes.each(function(i) {
                    return $(this).prepend(`<sup><a href='#${refStem}${i + 1}'>[${i + 1}]</a></sup> `).attr({
                        id: `${noteStem}${i + 1}`
                    }).appendTo(Footnotify.config.holder).wrap("<li>");
                });
            },
            calcOffsets: function(links, notes, holder) {
                var holderTop,
                    i,
                    lowestNote,
                    noteTop,
                    refTop,
                    results;
                holderTop = holder.offset().top;
                i = 0;
                lowestNote = 0;
                results = [];
                while (i < notes.length) {
                    refTop = links.eq(i).offset().top;

                    // this logic could be improved.
                    if (refTop < holderTop) {
                        if (refTop < lowestNote) {
                            noteTop = lowestNote;
                        } else {
                            noteTop = holderTop;
                        }
                    } else {
                        if (refTop < lowestNote) {
                            noteTop = lowestNote;
                        } else {
                            noteTop = refTop;
                        }
                    }
                    notes.eq(i).parent("li").css("top", noteTop);
                    lowestNote = notes.eq(i).offset().top + notes.eq(i).height();
                    results.push(i++);
                }
                return results;
            },
            uiBind: function() {
                // should use a debounced resize event here.
                // in Chrome zoom triggers resize; is this the case for all browsers?
                return $(window).bind('resize', () => {
                    return this.calcOffsets(this.el.$links, this.el.$notes, this.el.$holder);
                });
            },
            init: function(config) {
                var el;
                if (config && typeof config === 'object') {
                    $.extend(this.config, config);
                }
                el = this.el = this.getElements();
                if (el.$links.length !== el.$notes.length) {
                    console.warn("Note/ref length mismatch.");
                }
                this.setupRefs(el.$links);
                this.setupNotes(el.$notes, el.$links);
                this.calcOffsets(el.$links, el.$notes, el.$holder);
                return this.uiBind();
            }
        };

        Footnotify.init();

    }).call(this);

    //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFVBQUEsR0FHRSxDQUFBOzs7SUFBQSxNQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU8sZUFBUDtNQUNBLElBQUEsRUFBTyxpQkFEUDtNQUVBLE1BQUEsRUFBUyxZQUZUO01BR0EsU0FBQSxFQUFZLFlBSFo7TUFJQSxVQUFBLEVBQWE7SUFKYixDQURGO0lBT0EsV0FBQSxFQUFjLFFBQUEsQ0FBQSxDQUFBO2FBQ1o7UUFBQSxNQUFBLEVBQVMsQ0FBQSxDQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBZCxDQUFUO1FBQ0EsTUFBQSxFQUFTLENBQUEsQ0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQWQsQ0FEVDtRQUVBLE9BQUEsRUFBVSxDQUFBLENBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFkO01BRlY7SUFEWSxDQVBkOzs7O0lBY0EsRUFBQSxFQUFLLENBQUEsQ0FkTDtJQWdCQSxTQUFBLEVBQVksUUFBQSxDQUFDLEtBQUQsQ0FBQTtBQUNkLFVBQUEsUUFBQSxFQUFBO01BQUksUUFBQSxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUM7TUFDdkIsT0FBQSxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDdkIsS0FBSyxDQUFDLElBQU4sQ0FBVyxRQUFBLENBQUMsQ0FBRCxDQUFBO2VBQ1QsQ0FBQSxDQUFFLElBQUYsQ0FDRSxDQUFDLElBREgsQ0FDUSxDQUFBLENBQUEsQ0FBQSxDQUFJLENBQUEsR0FBRSxDQUFOLENBQUEsQ0FBQSxDQURSLENBRUUsQ0FBQyxJQUZILENBRVEsQ0FBQSxVQUFBLENBQUEsQ0FBYSxRQUFiLENBQUEsQ0FBQSxDQUF3QixDQUFBLEdBQUUsQ0FBMUIsQ0FBQSxFQUFBLENBRlIsQ0FHRSxDQUFDLElBSEgsQ0FHUSxJQUhSLEVBR2MsQ0FBQSxDQUFBLENBQUcsT0FBSCxDQUFBLENBQUEs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QU0sQ0FBQyxNQUFWLEtBQXNCLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBbkM7UUFDRSxPQUFPLENBQUMsSUFBUixDQUFhLDJCQUFiLEVBREY7O01BR0EsSUFBSSxDQUFDLFNBQUwsQ0FBZSxFQUFFLENBQUMsTUFBbEI7TUFDQSxJQUFJLENBQUMsVUFBTCxDQUFnQixFQUFFLENBQUMsTUFBbkIsRUFBMkIsRUFBRSxDQUFDLE1BQTlCO01BQ0EsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsRUFBRSxDQUFDLE1BQXBCLEVBQTRCLEVBQUUsQ0FBQyxNQUEvQixFQUF1QyxFQUFFLENBQUMsT0FBMUM7YUFDQSxJQUFJLENBQUMsTUFBTCxDQUFBO0lBYks7RUFuRVA7O0VBa0ZGLFVBQVUsQ0FBQyxJQUFYLENBQUE7QUFyRkEiLCJzb3VyY2VzQ29udGVudCI6WyJGb290bm90aWZ5ID1cbiAgXG4gICMgaWYgeW91IHdhbnQgdG8gdXNlIGRpZmZlcmVudCBzZWxlY3RvcnMgb3IgSURzLCBwYXNzIGFuIG9iamVjdCBsaWtlIHRoaXMgdG8gRm9vdG5vdGlmeS5pbml0KClcbiAgY29uZmlnIDogXG4gICAgbGluayA6IFwic3VwLmZuaWZ5LXJlZlwiXG4gICAgbm90ZSA6IFwic3Bhbi5mbmlmeS1ub3RlXCJcbiAgICBob2xkZXIgOiBcIi5mb290bm90ZXNcIlxuICAgIHJlZklkU3RlbSA6IFwiZm5pZnktcmVmLVwiXG4gICAgbm90ZUlkU3RlbSA6IFwiZm5pZnktbm90ZS1cIlxuICAgIFxuICBnZXRFbGVtZW50cyA6IC0+XG4gICAgJGxpbmtzIDogJCh0aGlzLmNvbmZpZy5saW5rKVxuICAgICRub3RlcyA6ICQodGhpcy5jb25maWcubm90ZSlcbiAgICAkaG9sZGVyIDogJCh0aGlzLmNvbmZpZy5ob2xkZXIpXG4gIFxuICAjIGluaXQoKSB3aWxsIHVzZSBnZXRFbGVtZW50cygpIHRvIGZpbGwgdGhpcyB3aXRoIGpRdWVyeSBvYmplY3RzIFxuICAjIGJhc2VkIG9uIHRoZSB2YWx1ZXMgb2YgY29uZmlnIHdoZW4gaW5pdCgpIGlzIGNhbGxlZC5cbiAgZWwgOiB7fVxuXG4gIHNldHVwUmVmcyA6IChsaW5rcykgLT5cbiAgICBub3RlU3RlbSA9IHRoaXMuY29uZmlnLm5vdGVJZFN0ZW1cbiAgICByZWZTdGVtICA9IHRoaXMuY29uZmlnLnJlZklkU3RlbVxuICAgIGxpbmtzLmVhY2ggKGkpIC0+XG4gICAgICAkKHRoaXMpXG4gICAgICAgIC5odG1sKFwiWyN7aSsxfV1cIilcbiAgICAgICAgLndyYXAoXCI8YSBocmVmPScjI3tub3RlU3RlbX0je2krMX0nPlwiKVxuICAgICAgICAuYXR0cihcImlkXCIsIFwiI3tyZWZTdGVtfSN7aSsxfVwiKVxuICBcbiAgc2V0dXBOb3RlcyA6IChub3RlcykgLT5cbiAgICBub3RlU3RlbSA9IHRoaXMuY29uZmlnLm5vdGVJZFN0ZW1cbiAgICByZWZTdGVtICA9IHRoaXMuY29uZmlnLnJlZklkU3RlbVxuICAgIG5vdGVzLmVhY2ggKGkpIC0+XG4gICAgICAkKHRoaXMpXG4gICAgICAgIC5wcmVwZW5kKFwiPHN1cD48YSBocmVmPScjI3tyZWZTdGVtfSN7aSsxfSc+WyN7aSsxfV08L2E+PC9zdXA+IFwiKVxuICAgICAgICAuYXR0cihcbiAgICAgICAgICBpZCA6IFwiI3tub3RlU3RlbX0je2krMX1cIlxuICAgICAgICApXG4gICAgICAgIC5hcHBlbmRUbyhGb290bm90aWZ5LmNvbmZpZy5ob2xkZXIpXG4gICAgICAgIC53cmFwKFwiPGxpPlwiKVxuXG4gIGNhbGNPZmZzZXRzIDogKGxpbmtzLCBub3RlcywgaG9sZGVyKSAtPlxuICAgIGhvbGRlclRvcCA9IGhvbGRlci5vZmZzZXQoKS50b3BcbiAgICBpID0gMFxuICAgIGxvd2VzdE5vdGUgPSAwXG5cbiAgICB3aGlsZSBpIDwgbm90ZXMubGVuZ3RoXG4gICAgICByZWZUb3AgPSBsaW5rcy5lcShpKS5vZmZzZXQoKS50b3BcbiAgICAgIFxuICAgICAgIyB0aGlzIGxvZ2ljIGNvdWxkIGJlIGltcHJvdmVkLlxuICAgICAgaWYgcmVmVG9wIDwgaG9sZGVyVG9wXG4gICAgICAgIGlmIHJlZlRvcCA8IGxvd2VzdE5vdGVcbiAgICAgICAgICBub3RlVG9wID0gbG93ZXN0Tm90ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgbm90ZVRvcCA9IGhvbGRlclRvcFxuICAgICAgZWxzZVxuICAgICAgICBpZiByZWZUb3AgPCBsb3dlc3ROb3RlXG4gICAgICAgICAgbm90ZVRvcCA9IGxvd2VzdE5vdGVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG5vdGVUb3AgPSByZWZUb3BcblxuICAgICAgbm90ZXMuZXEoaSkucGFyZW50KFwibGlcIikuY3NzKFwidG9wXCIsIG5vdGVUb3ApXG4gICAgICBsb3dlc3ROb3RlID0gbm90ZXMuZXEoaSkub2Zmc2V0KCkudG9wICsgbm90ZXMuZXEoaSkuaGVpZ2h0KClcbiAgICAgIGkrK1xuICBcbiAgdWlCaW5kIDogLT5cbiAgICAjIHNob3VsZCB1c2UgYSBkZWJvdW5jZWQgcmVzaXplIGV2ZW50IGhlcmUuXG4gICAgIyBpbiBDaHJvbWUgem9vbSB0cmlnZ2VycyByZXNpemU7IGlzIHRoaXMgdGhlIGNhc2UgZm9yIGFsbCBicm93c2Vycz9cbiAgICAkKHdpbmRvdykuYmluZCAncmVzaXplJywgPT5cbiAgICAgIHRoaXMuY2FsY09mZnNldHModGhpcy5lbC4kbGlua3MsIHRoaXMuZWwuJG5vdGVzLCB0aGlzLmVsLiRob2xkZXIgKVxuICBcbiAgaW5pdCA6IChjb25maWcpIC0+XG4gICAgXG4gICAgaWYgY29uZmlnICYmIHR5cGVvZihjb25maWcpIGlzICdvYmplY3QnXG4gICAgICAkLmV4dGVuZCh0aGlzLmNvbmZpZywgY29uZmlnKVxuICAgICAgXG4gICAgZWwgPSB0aGlzLmVsID0gdGhpcy5nZXRFbGVtZW50cygpXG5cbiAgICBpZiBlbC4kbGlua3MubGVuZ3RoIGlzbnQgZWwuJG5vdGVzLmxlbmd0aFxuICAgICAgY29uc29sZS53YXJuIFwiTm90ZS9yZWYgbGVuZ3RoIG1pc21hdGNoLlwiXG4gICAgXG4gICAgdGhpcy5zZXR1cFJlZnMoZWwuJGxpbmtzKVxuICAgIHRoaXMuc2V0dXBOb3RlcyhlbC4kbm90ZXMsIGVsLiRsaW5rcylcbiAgICB0aGlzLmNhbGNPZmZzZXRzKGVsLiRsaW5rcywgZWwuJG5vdGVzLCBlbC4kaG9sZGVyKVxuICAgIHRoaXMudWlCaW5kKClcbiAgICBcbkZvb3Rub3RpZnkuaW5pdCgpIl19
    //# sourceURL=coffeescript
    //# sourceURL=pen.js
    </script>

</body>