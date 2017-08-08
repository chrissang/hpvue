
var moduleOrderStatic = [];
var moduleOrder = [];
var alphaOrder = [];
var counter = 0;

const ugWeb = '//www.uncommongoods.com';

class Dependents {
    constructor(params) {
        this.modulePosition = params.data.index + 1;
        this.displayGroupViewPortSize = params.data.displayGroupOn;
        this.viewPortSize = ko.observable(breakpointValue());
        this.displayOn = function(viewPortSize) {
            return {
                'small': this.viewPortSize() === 'small' || this.viewPortSize() === 'medium' || this.viewPortSize() === 'large' || this.viewPortSize() === 'xlarge' ? true : false,
                'medium': this.viewPortSize() === 'medium' || this.viewPortSize() === 'large' || this.viewPortSize() === 'xlarge' ? true : false,
                'large': this.viewPortSize() === 'large' || this.viewPortSize() === 'xlarge' ? true : false,
                'xlarge': this.viewPortSize() === 'xlarge' ? true : false
            }[viewPortSize]
        }
        this.displayGroup = function(arry) {
            var sectionArray = [];
            arry.forEach((el,i) => {
                sectionArray.push(el.displayModuleOn);
            })
            if (sectionArray.indexOf('small') > -1) {
                return 'small';
            } else if (sectionArray.indexOf('medium') > -1) {
                return 'medium';
            } else if (sectionArray.indexOf('large') > -1) {
                return 'large';
            } else {
                return 'xlarge';
            }
        }
        this.responsiveImage = function(itemId, largeImage, smallImage) {
            var responsiveValue;
            var largeImageSize = largeImage.split('_').pop().split('.')[0].slice(0, -2);
            var smallImageSize = smallImage.split('_').pop().split('.')[0].slice(0, -2);
            responsiveValue = smallImageSize ? smallImage + ' ' + smallImageSize + 'w, ' : productImgPath(itemId,360) + ' 360w, ';
            responsiveValue += largeImageSize ? largeImage + ' ' + largeImageSize + 'w' : productImgPath(itemId,640) + ' 640w';
            return responsiveValue;
        }
        this.isVideo = function(video) {
            return video.split('.').pop() === 'mp4' ? true : false;
        }
        this.posterImage = function(videoFile) {
            return videoFile.split('.').shift() + '.jpg';
        }
        this.isEven = function(index) {
            return index % 2 === 0 ? true : false
        }
        this.classNameBlockGrid = function(sectionData) {
            this.nonHiddenModuleSections = [];
            if (this.viewPortSize() === 'small') {
                return 'small-6 columns';
            } else if(this.viewPortSize() === 'medium') {
                sectionData.forEach((module,index) => {
                    if (module.displayModuleOn === 'small' || module.displayModuleOn === 'medium') {
                        this.nonHiddenModuleSections.push(module.displayModuleOn)
                    }
                })
                return {
                    '4': 'medium-3 columns',
                    '6': 'medium-2 columns'
                }[this.nonHiddenModuleSections.length];

            } else if(this.viewPortSize() === 'large') {
                sectionData.forEach((module,index) => {
                    if (module.displayModuleOn === 'small' || module.displayModuleOn === 'medium' || module.displayModuleOn === 'large') {
                        this.nonHiddenModuleSections.push(module.displayModuleOn)
                    }
                })
                return {
                    '4': 'large-3 columns',
                    '6': 'large-2 columns'
                }[this.nonHiddenModuleSections.length];
            } else {
                sectionData.forEach((module,index) => {
                    if (module.displayModuleOn === 'small' || module.displayModuleOn === 'medium' || module.displayModuleOn === 'large' || module.displayModuleOn === 'xlarge') {
                        this.nonHiddenModuleSections.push(module.displayModuleOn)
                    }
                })
                return {
                    '4': 'medium-3 columns',
                    '6': 'medium-2 columns'
                }[this.nonHiddenModuleSections.length];
            }

        }
        this.className = function(sectionData) {
            var nonHiddenModuleSections = [];
            if(this.viewPortSize() === 'large') {
                sectionData.forEach((module,index) => {
                    if (module.displayModuleOn === 'small' || module.displayModuleOn === 'medium' || module.displayModuleOn === 'large') {
                        nonHiddenModuleSections.push(module.displayModuleOn)
                    }
                })
                return {
                    '2': 'large-6 columns',
                    '3': 'large-4 columns',
                    '4': 'large-6 columns'
                }[nonHiddenModuleSections.length];
            } else {
                sectionData.forEach((module,index) => {
                    if (module.displayModuleOn === 'small' || module.displayModuleOn === 'medium' || module.displayModuleOn === 'large' || module.displayModuleOn === 'xlarge') {
                        nonHiddenModuleSections.push(module.displayModuleOn)
                    }
                })
                return {
                    '2': 'large-6 columns',
                    '3': 'large-4 columns',
                    '4': 'large-6 columns'
                }[nonHiddenModuleSections.length];
            }
        }

        ko.bindingHandlers.resizeView = {
            init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                $(window).resize(function () {
                    var breakpoint = breakpointValue();
                    viewModel.viewPortSize(breakpoint);
                });

                var section = allBindings().resizeView;
                var display = allBindings().if;

                moduleOrderStatic.push(section);

                if (display) {
                    moduleOrder.push(section);

                } else {
                   moduleOrder.push('');
                }

                $(document).ready(function() {
                    var breakpoint = breakpointValue();
                    viewModel.viewPortSize(breakpoint);
                });
            },
            update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                var display = allBindings().if;
                var index = viewModel.modulePosition - 1;
                var totalModules = bindingContext.$parents[1].totalModules;
                var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

                $(document).ready(function() {
                    if (display) {
                        moduleOrder[index] = moduleOrderStatic[index];
                    } else {
                        moduleOrder[index] = '';
                    }

                    if(display) {
                        var elements = Array.from(ko.virtualElements.firstChild(element).nextElementSibling.querySelectorAll('a'));
                        var arryLength = elements.length;


                        while (arryLength--) {
                            if (elements[arryLength].parentElement.classList.contains("swiper-slide-duplicate")) {
                                elements.splice(arryLength, 1);
                            }
                        }

                        elements.forEach((el,index) => {
                            if (index === 0) {
                                alphaOrder.push(alpha.charAt(counter));
                                counter++
                            }

                            var linkNumber = index+1;
                            var dataType = el.getAttribute("data-type");
                            var dataDescription = el.getAttribute('data-description').split(' ').join('_');
                            var moduleType = allBindings().resizeView;
                            var alphaChar = alphaOrder[alphaOrder.length-1];

                            if(dataDescription != '') {
                                dataDescription = '_'+dataDescription;
                            }

                            var trackingCode = 'hp_module_' + alphaChar + linkNumber + '_'+ dataType + '_' + moduleType + dataDescription;
                            var trackingLink = el.getAttribute("href");

                            var ctaText = el.getAttribute("data-cta") ? el.getAttribute("data-cta") : 'NA';
                            var itemNumber = el.getAttribute("data-itemNumber") ? el.getAttribute("data-itemNumber") : "NA";
                            var sectionDescription = el.getAttribute("data-sectionDescription") ? el.getAttribute("data-sectionDescription") : 'NA';

                            var id = alphaChar + linkNumber + '_' + moduleType;
                            var name = ctaText.replace(/'/g, "")+'_'+trackingLink.replace(/\/\/www.uncommongoods.com/g, '').replace("//blog.uncommongoods.com","/blog");
                            var creative = itemNumber;
                            var pos = sectionDescription;

                            trackingLink = trackingLink.replace(/\/\/www.uncommongoods.com/g, '');

                            if (trackingLink !== '' && moduleType != 'TL_SEO') {
                                if (trackingLink.includes("//blog.uncommongoods.com")) {
                                    trackingLink = trackingLink.replace("//blog.uncommongoods.com","/blog");
                                    $(el).attr("onclick", `javascript: pageTracker._trackPageview('/internal`+trackingLink+`?source=`+trackingCode+`');dataLayer.push({'internalHPModuleLinkUrl':'/internal`+trackingLink+`?source=`+trackingCode+`'},{'event':'fireGTMTrackHPModulePageView'});onPromoClick('`+id+`', '`+name+`', '`+creative+`', '`+pos+`')`);
                                } else {
                                    $(el).attr("onclick", `javascript: pageTracker._trackPageview('/internal`+trackingLink+`?source=`+trackingCode+`');dataLayer.push({'internalHPModuleLinkUrl':'/internal`+trackingLink+`?source=`+trackingCode+`'},{'event':'fireGTMTrackHPModulePageView'});onPromoClick('`+id+`', '`+name+`', '`+creative+`', '`+pos+`')`);
                                }
                            } else if (trackingLink !== '' && moduleType === 'TL_SEO') {
                                $(el).attr("onclick", `javascript: pageTracker._trackPageview('/internal`+trackingLink+`?source=`+trackingCode+`');dataLayer.push({'internalHPModuleLinkUrl':'/internal`+trackingLink+`?source=`+trackingCode+`'},{'event':'fireGTMTrackHPModulePageView'});onPromoClick('`+id+`', '`+name+`', '`+creative+`', '`+pos+`')`);
                            } else {
                                $(el).attr("onclick", `javascript: pageTracker._trackPageview('/internal`+trackingLink+`?source=`+trackingCode+`');dataLayer.push({'internalHPModuleLinkUrl':'/internal`+trackingLink+`?source=`+trackingCode+`'},{'event':'fireGTMTrackHPModulePageView'});onPromoClick('`+id+`', '`+name+`', '`+creative+`', '`+pos+`')`);
                                $('a[href=""]').click(function (event) { // where href are blank
                                    event.preventDefault();
                                })
                            }
                        })
                    }

                    if (viewModel.modulePosition === totalModules) {
                        var moduleOrderRefresh = moduleOrder.filter(Boolean);
                        counter = 0;
                        alphaOrder = [];
                        moduleOrderRefresh[moduleOrderRefresh.length - 1] === 'BD' ? document.getElementsByClassName("prefooterLine")[0].style.display='none' : document.getElementsByClassName("prefooterLine")[0].style.display='block';
                    }
                })
            }
        };
        ko.virtualElements.allowedBindings.resizeView = true;
    }
};

//Returns screen viewport size (small, medium, large, xlarge)
function breakpointValue() {
    return window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');
};
//Returns default image path
function productImgPath(itemId,size) {
    var itemDir = '/images/items/';
    var itemIdTrim = itemId.toString().slice(0, -2);

    if (size === 640) {
        return itemDir+itemIdTrim+'00/'+itemId+'_1_640px.jpg';
    }
    if (size === 360) {
        return itemDir+itemIdTrim+'00/'+itemId+'_1_360px.jpg';
    }
}
//Returns url with domain attached unless already included in the link
function addUgDomain(link) {
    if (link.substring(0, 2) == '//') {
        return link;
    }
    if (link === '') {
        return '';
    }
    else {
        return link;
    }
}
//Mobile HP modules
ko.components.register('large-feature-module', {
    viewModel: class LargeFeatureModuleComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.params = params;
            this.largeFeatureModulesSections = params.data.sections;
            this.displayGroupViewPortSize = ko.observable();
            this.displayGroupViewPortSize(this.displayGroup(this.largeFeatureModulesSections));
        }
    },
    template: `
        <!-- ko if: displayOn(displayGroupViewPortSize()), resizeView: 'LF' -->
            <section data-bind="" class="large-feature-module background-color-off-white">
                <!-- ko foreach: largeFeatureModulesSections -->
                    <!-- ko if: $parent.displayOn(displayModuleOn) -->
                        <div class="row fullwidth">
                            <div class="small-12 large-11 xlarge-10 xxlarge-8 large-centered columns">
                                <a data-bind="attr: { href: addUgDomain(image.link), 'data-type': 'Image', 'data-description': image.description, 'data-itemNumber': item, 'data-cta': cta.text }">
                                    <picture>
                                        <!--[if IE 9]><video style="display: none;"><![endif]-->
                                            <source data-bind="attr: { media: '(min-width: 40.063em)', srcset: image.customImage.large ? image.customImage.large : productImgPath(item,640) }">
                                            <source data-bind="attr: { media: '(max-width: 40em)', srcset: image.customImage.small ? image.customImage.small : productImgPath(item,360) }">
                                        <!--[if IE 9]></video><![endif]-->

                                        <!-- ko if: $parent.viewPortSize() === 'small' -->
                                            <div class="responsively-lazy preventReflow">
                                                <img data-bind="attr: { src: image.customImage.small ? image.customImage.small : productImgPath(item,360), alt: cta.text }">
                                            </div>
                                        <!-- /ko -->

                                        <!-- ko if: $parent.viewPortSize() != 'small' -->
                                            <!-- ko if: $parent.isVideo(image.customImage.large) -->
                                                <video loop muted autoplay data-bind="attr: { poster: $parent.posterImage(image.customImage.large) }">
                                                    <source data-bind="attr: { src: image.customImage.large }" type="video/mp4">
                                                    <source data-bind="attr: { src: image.customImage.large }" type="video/webm">
                                                </video>
                                            <!-- /ko -->
                                            <!-- ko if: !$parent.isVideo(image.customImage.large) -->
                                                <div class="responsively-lazy preventReflow">
                                                    <div data-bind="style: { backgroundImage: 'url( '+ image.customImage.large  +' )'}" class="LF_backgroundImage"></div>
                                                </div>
                                            <!-- /ko -->
                                        <!-- /ko -->
                                    </picture>
                                </a>
                            </div>
                        </div>
                        <div class="row fullwidth">
                            <div class="small-12 medium-8 large-6 small-centered columns">
                                <div class="white-box-container text-center">
                                    <a class="a-secondary" data-bind="attr: { href: addUgDomain(headline.link), 'data-type': 'Headline', 'data-description': headline.description, 'data-itemNumber': item, 'data-cta': cta.text }">
                                        <h1 data-bind="html: headline.text"></h1>
                                    </a>
                                    <p class="body-small-override"><a data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text }"></a></p>
                                </div>
                            </div>
                        </div>
                    <!-- /ko -->
                <!-- /ko -->
            </section>
        <!-- /ko -->`, synchronous: true
});

ko.components.register('small-feature-module', {
    viewModel: class SmallFeatureModuleComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.params = params;
            this.smModulesSections = params.data.sections;
            this.displayGroupViewPortSize = ko.observable();
            this.displayGroupViewPortSize(this.displayGroup(this.smModulesSections));
        }
    },
    template: `
        <!-- ko if: displayOn(displayGroupViewPortSize()), resizeView: 'SF' -->
            <section data-bind="" class="small-feature-module background-color-white">
                <!-- ko if: viewPortSize() === 'small' || viewPortSize() === 'medium' -->
                    <!-- ko foreach: smModulesSections -->
                        <!-- ko if: $parent.displayOn(displayModuleOn) -->
                            <!-- ko if: $parent.isEven($index()) -->
                                <div class="row fullwidth">
                                    <div class="container">
                                        <div class="small-6 medium-7 columns">
                                            <div data-bind="style: { margin: $parent.viewPortSize() === 'medium' ? '-1.5rem 0 0 -1.5rem' : '0' }">
                                                <a data-bind="attr: { href: addUgDomain(image.link), 'data-type': 'Image', 'data-description': image.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                    <div class="responsively-lazy preventReflow">
                                                        <img class="right" data-bind="attr: { 'data-srcset': $parent.responsiveImage(item, image.customImage.large, image.customImage.small), src: image.customImage.large ? image.customImage.large : productImgPath(item,360), alt: cta.text }"/>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="small-6 medium-5 columns text-center">
                                            <div class="copyContainer">
                                                <!-- ko if: section.text -->
                                                    <label class="body-small-caps-override"><a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section', 'data-description': section.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></label>
                                                <!-- /ko -->
                                                <a data-bind="attr: { href: addUgDomain(headline.link), 'data-type': 'Headline', 'data-description': headline.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"><h3 data-bind="html: headline.text"></h3></a>
                                                <p class="body-small-override"><a data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text }"></a></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <!-- /ko -->

                            <!-- ko if: !$parent.isEven($index()) -->
                                <div class="row fullwidth">
                                    <div class="container">
                                        <div class="small-6 medium-5 columns text-center">
                                            <div class="copyContainer">
                                                <!-- ko if: section.text -->
                                                    <label class="body-small-caps-override"><a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section', 'data-description': section.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></label>
                                                <!-- /ko -->
                                                <a data-bind="attr: { href: addUgDomain(headline.link), 'data-type': 'Headline', 'data-description': headline.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"><h3 data-bind="html: headline.text"></h3></a>
                                                <p class="body-small-override"><a data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></p>
                                            </div>
                                        </div>
                                        <div class="small-6 medium-7 columns">
                                            <div data-bind="style: { margin: $parent.viewPortSize() === 'medium' ? '-1.5rem -1.5rem 0 0' : '0' }">
                                                <a data-bind="attr: { href: addUgDomain(image.link), 'data-type': 'Image', 'data-description': image.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description}">
                                                    <div class="responsively-lazy preventReflow">
                                                        <img class="right" data-bind="attr: { 'data-srcset': $parent.responsiveImage(item, image.customImage.large, image.customImage.small), src: image.customImage.large ? image.customImage.large : productImgPath(item,360), alt: cta.text }"/>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <!-- /ko -->
                        <!-- /ko -->
                    <!-- /ko -->
                <!-- /ko -->

                <!-- ko if: viewPortSize() === 'large' || viewPortSize() === 'xlarge' -->
                    <div class="row fullwidth">
                        <div class="large-11 xlarge-10 xxlarge-8 large-centered columns">
                            <div class="row fullwidth">
                                <!-- ko foreach: smModulesSections -->
                                    <!-- ko if: $parent.displayOn(displayModuleOn) -->
                                        <div data-bind="attr: { class: $parent.className($parent.smModulesSections) }">
                                            <a data-bind="attr: { href: addUgDomain(image.link), 'data-type': 'Image', 'data-description': image.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                <div class="responsively-lazy preventReflow">
                                                    <img class="right" data-bind="attr: { 'data-srcset': $parent.responsiveImage(item, image.customImage.large, image.customImage.small), src: image.customImage.large ? image.customImage.large : productImgPath(item,360), alt: cta.text }"/>
                                                </div>
                                            </a>
                                            <div class="row">
                                                <div class="large-12 large-centered columns">
                                                    <div class="white-box-container text-center">
                                                        <!-- ko if: section.text -->
                                                            <label class="body-small-caps-override"><a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section', 'data-description': section.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></label>
                                                        <!-- /ko -->
                                                        <a data-bind="attr: { href: addUgDomain(headline.link), 'data-type': 'Headline', 'data-description': headline.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"><h2 data-bind="html: headline.text"></h2></a>
                                                        <p class="body-small-override"><a data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <!-- /ko -->
                                <!-- /ko -->
                            </div>
                        </div>
                    </div>
                <!-- /ko -->
            </section>
        <!-- /ko -->`, synchronous: true
});

ko.components.register('basic-story-module', {
    viewModel: class BasicStoryModuleComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.params = params;
            this.basicStoryModulesSections = params.data.sections;
            this.displayGroupViewPortSize = ko.observable();
            this.displayGroupViewPortSize(this.displayGroup(this.basicStoryModulesSections));
        }
    },
    template: `
        <!-- ko if: displayOn(displayGroupViewPortSize()), resizeView: 'BS' -->
            <section data-bind="" class="basic-story-module background-color-off-white">
                <!-- ko if: viewPortSize() === 'small' -->
                    <!-- ko foreach: basicStoryModulesSections -->
                        <!-- ko if: $parent.displayOn(displayModuleOn) -->
                            <div class="row container">
                                <!-- ko if: section.text -->
                                    <div class="small-12 text-center columns">
                                        <label class="body-small-caps-override"><a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section', 'data-description': section.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description  }"></a></label>
                                    </div>
                                <!-- /ko -->

                                <div class="small-12 columns">
                                    <div class="row">
                                        <div class="small-10 small-centered text-center columns">
                                            <a data-bind="attr: { href: addUgDomain(headline.link), 'data-type': 'Headline', 'data-description': headline.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"><h2 data-bind="html: headline.text"></h2></a>
                                            <a data-bind="attr: { href: addUgDomain(image.link), 'data-type': 'Image', 'data-description': image.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                <div class="responsively-lazy preventReflow">
                                                    <img data-bind="attr: { 'data-srcset': $parent.responsiveImage(item, image.customImage.large, image.customImage.small), src: image.customImage.large ? image.customImage.large : productImgPath(item,640), alt: cta.text }"/>
                                                </div>
                                            </a>
                                            <a data-bind="attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                <button class="btn-secondary expand" data-bind="html: cta.text"></button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <!-- /ko -->
                    <!-- /ko -->
                <!-- /ko -->

                <!-- ko if: viewPortSize() === 'medium' -->
                    <!-- ko foreach: basicStoryModulesSections -->
                        <!-- ko if: $parent.displayOn(displayModuleOn) -->
                            <!-- ko if: $parent.isEven($index()) -->
                                <div class="row fullwidth">
                                    <div class="container">
                                        <div class="medium-7 columns">
                                            <div style="margin-top: -1.5rem; margin-left: -1.5rem;">
                                                <a data-bind="attr: { href: addUgDomain(image.link), 'data-type': 'Image', 'data-description': image.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                    <div class="responsively-lazy preventReflow">
                                                        <img class="right" data-bind="attr: { 'data-srcset': $parent.responsiveImage(item, image.customImage.large, image.customImage.small), src: image.customImage.large ? image.customImage.large : productImgPath(item,360), alt: cta.text }"/>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>

                                        <div class="medium-5 columns text-center">
                                            <div class="copyContainer">
                                                <!-- ko if: section.text -->
                                                    <label class="body-small-caps-override"><a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section', 'data-description': section.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></label>
                                                <!-- /ko -->
                                                <a data-bind="attr: { href: addUgDomain(headline.link), 'data-type': 'Headline', 'data-description': headline.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"><h2 data-bind="html: headline.text"></h2></a>
                                                <p class="body-small-override"><a data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <!-- /ko -->

                            <!-- ko if: !$parent.isEven($index()) -->
                                <div class="row fullwidth">
                                    <div class="container">
                                        <div class="medium-5 columns text-center">
                                            <div class="copyContainer">
                                                <!-- ko if: section.text -->
                                                    <label class="body-small-caps-override"><a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section', 'data-description': section.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></label>
                                                <!-- /ko -->
                                                <a data-bind="attr: { href: addUgDomain(headline.link), 'data-type': 'Headline', 'data-description': headline.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"><h2 data-bind="html: headline.text"></h2></a>
                                                <p class="body-small-override"><a data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></p>
                                            </div>
                                        </div>
                                        <div class="medium-7 columns">
                                            <div style="margin-top: -1.5rem; margin-right: -1.5rem;">
                                                <a data-bind="attr: { href: addUgDomain(image.link), 'data-type': 'Image', 'data-description': image.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                    <div class="responsively-lazy preventReflow">
                                                        <img class="right" data-bind="attr: { 'data-srcset': $parent.responsiveImage(item, image.customImage.large, image.customImage.small), src: image.customImage.large ? image.customImage.large : productImgPath(item,360), alt: cta.text }"/>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <!-- /ko -->
                        <!-- /ko -->
                    <!-- /ko -->
                <!-- /ko -->

                <!-- ko if: viewPortSize() === 'large' || viewPortSize() === 'xlarge' -->
                    <div class="row fullwidth">
                        <div class="large-11 xlarge-10 xxlarge-8 large-centered columns">
                            <div class="row">
                                <!-- ko foreach: basicStoryModulesSections -->
                                    <!-- ko if: $parent.displayOn(displayModuleOn) -->
                                        <div data-bind="attr: { class: $parent.className($parent.basicStoryModulesSections) }">
                                            <a data-bind="attr: { href: addUgDomain(image.link), 'data-type': 'Image', 'data-description': image.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                <div class="responsively-lazy preventReflow">
                                                    <img class="right" data-bind="attr: { 'data-srcset': $parent.responsiveImage(item, image.customImage.large, image.customImage.small), src: image.customImage.large ? image.customImage.large : productImgPath(item,360), alt: cta.text }"/>
                                                </div>
                                            </a>
                                            <div class="row">
                                                <div class="large-12 large-centered columns">
                                                    <div class="white-box-container text-center">
                                                        <!-- ko if: section.text -->
                                                            <label class="body-small-caps-override"><a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section' , 'data-description': section.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></label>
                                                        <!-- /ko -->
                                                        <a data-bind="attr: { href: addUgDomain(headline.link), 'data-type': 'Headline', 'data-description': headline.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"><h2 data-bind="html: headline.text"></h2></a>
                                                        <p class="body-small-override"><a data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <!-- /ko -->
                                <!-- /ko -->
                            </div>
                        </div>
                    </div>
                <!-- /ko -->
            </section>
        <!-- /ko -->`, synchronous: true
});

ko.components.register('extended-story-module', {
    viewModel: class ExtendedStoryModuleComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.params = params;
            this.extendedStoryModulesSections = params.data.sections;
            this.displayGroupViewPortSize = ko.observable();
            this.displayGroupViewPortSize(this.displayGroup(this.extendedStoryModulesSections));
        }
    },
    template: `
        <!-- ko if: displayOn(displayGroupViewPortSize()), resizeView: 'ES' -->
            <section data-bind="" class="extended-story-module background-color-off-white">
                <!-- ko if: viewPortSize() === 'small' -->
                    <!-- ko foreach: extendedStoryModulesSections -->
                        <!-- ko if: $parent.displayOn(displayModuleOn) -->
                            <div class="row container">
                                <div class="small-12 text-center columns">
                                    <!-- ko if: section.text -->
                                        <div class="small-12 text-center columns">
                                            <label class="body-small-caps-override"><a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section', 'data-description': section.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description}"></a></label>
                                        </div>
                                    <!-- /ko -->
                                    <div class="small-12 text-center columns">
                                        <a data-bind="attr: { href: addUgDomain(headline.link), 'data-type': 'Headline', 'data-description': headline.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"><h2 data-bind="html: headline.text"></h2></a>
                                    </div>
                                    <div class="small-12 text-center columns">
                                        <div class="row">
                                            <div class="small-11 small-centered columns">
                                                <a data-bind="attr: { href: addUgDomain(image.link), 'data-type': 'Image', 'data-description': image.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                    <div class="responsively-lazy preventReflow itemPhoto">
                                                        <img data-bind="attr: { 'data-srcset': $parent.responsiveImage(item, image.customImage.large, image.customImage.small), src: image.customImage.large ? image.customImage.large : productImgPath(item,640), alt: cta.text }"/>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="small-11 text-center columns">
                                        <p class="text-left">
                                            <a class="a-secondary" data-bind="html: copy.text, attr: { href: addUgDomain(copy.link), 'data-type': 'Copy', 'data-description': copy.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a>
                                        </p>
                                        <p class="body-small-override"><a data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></p>
                                    </div>
                                </div>
                            </div>
                        <!-- /ko -->
                    <!-- /ko -->
                <!-- /ko -->

                <!-- ko if: viewPortSize() === 'medium' || viewPortSize() === 'large' || viewPortSize() === 'xlarge'-->
                    <!-- ko foreach: extendedStoryModulesSections -->
                        <!-- ko if: $parent.displayOn(displayModuleOn) -->
                            <!-- ko if: $parent.isEven($index()) -->
                                <div class="row fullwidth">
                                    <div class="medium-12 large-11 xlarge-10 xxlarge-8 large-centered columns">
                                        <div class="row">
                                            <div class="container">
                                                <div class="medium-7 large-8 columns">
                                                    <div style="margin: -1.5rem 0 0 -1.5rem;">
                                                        <a data-bind="attr: { href: addUgDomain(image.link), 'data-type': 'Image', 'data-description': image.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                            <div class="responsively-lazy preventReflow">
                                                                <img class="right" data-bind="attr: { 'data-srcset': $parent.responsiveImage(item, image.customImage.large, image.customImage.small), src: image.customImage.large ? image.customImage.large : productImgPath(item,360), alt: cta.text }"/>
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>

                                                <div class="medium-5 large-4 columns text-center">
                                                    <div class="copyContainer">
                                                        <!-- ko if: section.text -->
                                                            <label class="body-small-caps-override"><a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section', 'data-description': section.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></label>
                                                        <!-- /ko -->
                                                        <a data-bind="attr: { href: addUgDomain(headline.link), 'data-type': 'Headline', 'data-description': headline.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"><h2 data-bind="html: headline.text"></h2></a>
                                                        <p class="text-left">
                                                            <a class="a-secondary" data-bind="html: copy.text, attr: { href: addUgDomain(copy.link), 'data-type': 'Copy', 'data-description': copy.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a>
                                                        </p>
                                                        <p class="body-small-override"><a data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <!-- /ko -->

                            <!-- ko if: !$parent.isEven($index()) -->
                                <div class="row fullwidth">
                                    <div class="medium-12 large-11 xlarge-10 xxlarge-8  large-centered columns">
                                        <div class="row">
                                            <div class="container">
                                                <div class="medium-5 large-4 columns text-center">
                                                    <div class="copyContainer">
                                                        <!-- ko if: section.text -->
                                                            <label class="body-small-caps-override"><a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section', 'data-description': section.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></label>
                                                        <!-- /ko -->
                                                        <a data-bind="attr: { href: addUgDomain(headline.link), 'data-type': 'Headline', 'data-description': headline.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"><h2 data-bind="html: headline.text"></h2></a>
                                                        <p class="text-left">
                                                            <a class="a-secondary" data-bind="html: copy.text, attr: { href: addUgDomain(copy.link), 'data-type': 'Copy', 'data-description': copy.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a>
                                                        </p>
                                                        <p class="body-small-override"><a data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></p>
                                                    </div>
                                                </div>
                                                <div class="medium-7 large-8 columns">
                                                    <div style="margin: -1.5rem -1.5rem 0 0;">
                                                        <a data-bind="attr: { href: addUgDomain(image.link), 'data-type': 'Image', 'data-description': image.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                            <div class="responsively-lazy preventReflow">
                                                                <img class="right" data-bind="attr: { 'data-srcset': $parent.responsiveImage(item, image.customImage.large, image.customImage.small), src: image.customImage.large ? image.customImage.large : productImgPath(item,360), alt: cta.text }"/>
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <!-- /ko -->
                        <!-- /ko -->
                    <!-- /ko -->
                <!-- /ko -->
            </section>
        <!-- /ko -->`, synchronous: true
});

ko.components.register('collection-grid-module', {
    viewModel: class CollectionGridModuleComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.params = params;
            this.section = params.data.section;
            this.headline = params.data.headline;
            this.cta = params.data.cta;
            this.collectionGridModulesSections = params.data.sections;
            this.arrayContent1 = this.collectionGridModulesSections[0];
            this.arrayContent2 = this.collectionGridModulesSections[1];
            this.arrayContent3 = this.collectionGridModulesSections[2];
            this.arrayContent4 = this.collectionGridModulesSections[3];
            this.arrayContent5 = this.collectionGridModulesSections[4];
            this.arrayContent6 = this.collectionGridModulesSections[5];
            this.displayGroupViewPortSize = ko.observable();
            this.displayGroupViewPortSize(params.data.displayModuleOn);
        }
    },
    template: `
        <!-- ko if: displayOn(displayGroupViewPortSize()), resizeView: 'CG' -->
            <section data-bind="" class="collection-grid-module background-color-off-white">
                <div class="row fullwidth">
                    <div class="small-12 large-11 xlarge-10 xxlarge-8 large-centered columns">
                        <div class="row container">
                            <div class="small-12 medium-6 columns">
                                <div class="flex">
                                    <div class="small-8-width">
                                        <a data-bind="attr: { href: addUgDomain(arrayContent1.image.link), 'data-type': 'Image', 'data-description': arrayContent1.image.description, 'data-itemNumber': arrayContent1.item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                            <div class="responsively-lazy preventReflow">
                                                <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent1.item, arrayContent1.image.customImage.large, arrayContent1.image.customImage.small), src: arrayContent1.image.customImage.large ? arrayContent1.image.customImage.large : productImgPath(arrayContent1.item,360), alt: cta.text }"/>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="small-4-width">
                                        <div>
                                            <a data-bind="attr: { href: addUgDomain(arrayContent2.image.link), 'data-type': 'Image', 'data-description': arrayContent2.image.description, 'data-itemNumber': arrayContent2.item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                <div class="responsively-lazy preventReflow">
                                                    <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent2.item, arrayContent2.image.customImage.large, arrayContent2.image.customImage.small), src: arrayContent2.image.customImage.large ? arrayContent2.image.customImage.large : productImgPath(arrayContent2.item,360), alt: cta.text }"/>
                                                </div>
                                            </a>
                                        </div>
                                        <div>
                                            <a data-bind="attr: { href: addUgDomain(arrayContent3.image.link), 'data-type': 'Image', 'data-description': arrayContent3.image.description, 'data-itemNumber': arrayContent3.item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                <div class="responsively-lazy preventReflow">
                                                    <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent3.item, arrayContent3.image.customImage.large, arrayContent3.image.customImage.small), src: arrayContent3.image.customImage.large ? arrayContent3.image.customImage.large : productImgPath(arrayContent3.item,360), alt: cta.text }"/>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- ko if: viewPortSize() === 'small' -->
                                <div class="small-12 text-center columns white-box-container">
                                    <!-- ko if: section.text -->
                                        <label class="body-small-caps-override"><a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section', 'data-description': section.description, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></label>
                                    <!-- /ko -->

                                    <a class="a-secondary" data-bind="attr: { href: addUgDomain(headline.link), 'data-type': 'Headline', 'data-description': headline.description, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                        <h3 data-bind="html: headline.text"></h3>
                                    </a>

                                    <p class="body-small-override"><a data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></p>
                                </div>
                            <!-- /ko -->

                            <div class="small-12 medium-6 columns">
                                <div class="flex">
                                    <div class="small-8-width">
                                        <a data-bind="attr: { href: addUgDomain(arrayContent4.image.link), 'data-type': 'Image', 'data-description': arrayContent4.image.description, 'data-itemNumber': arrayContent4.item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                            <div class="responsively-lazy preventReflow">
                                                <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent4.item, arrayContent4.image.customImage.large, arrayContent4.image.customImage.small), src: arrayContent4.image.customImage.large ? arrayContent4.image.customImage.large : productImgPath(arrayContent4.item,360), alt: cta.text }"/>
                                            </div>
                                        </a>
                                    </div>
                                    <div class="small-4-width">
                                        <div>
                                            <a data-bind="attr: { href: addUgDomain(arrayContent5.image.link), 'data-type': 'Image', 'data-description': arrayContent5.image.description, 'data-itemNumber': arrayContent5.item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                <div class="responsively-lazy preventReflow">
                                                    <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent5.item, arrayContent5.image.customImage.large, arrayContent5.image.customImage.small), src: arrayContent5.image.customImage.large ? arrayContent5.image.customImage.large : productImgPath(arrayContent5.item,360), alt: cta.text }"/>
                                                </div>
                                            </a>
                                        </div>
                                        <div>
                                            <a data-bind="attr: { href: addUgDomain(arrayContent6.image.link), 'data-type': 'Image', 'data-description': arrayContent6.image.description, 'data-itemNumber': arrayContent6.item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                <div class="responsively-lazy preventReflow">
                                                    <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent6.item, arrayContent6.image.customImage.large, arrayContent6.image.customImage.small), src: arrayContent6.image.customImage.large ? arrayContent6.image.customImage.large : productImgPath(arrayContent6.item,360), alt: cta.text }"/>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- ko if: viewPortSize() != 'small' -->
                                <div class="small-12 columns">
                                    <div class="row">
                                        <div class="medium-8 large-6 medium-centered columns">
                                            <div class="white-box-container text-center">
                                                <!-- ko if: section.text -->
                                                    <label class="body-small-caps-override"><a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section', 'data-description': section.description, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></label>
                                                <!-- /ko -->
                                                <a data-bind="attr: { href: addUgDomain(headline.link), 'data-type': 'Headline', 'data-description': headline.description, 'data-cta': cta.text, 'data-sectionDescription': section.description }"><h1 data-bind="html: headline.text"></h1></a>
                                                <p class="body-small-override"><a data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <!-- /ko -->
                        </div>
                    </div>
                </div>
            </section>
        <!-- /ko -->`, synchronous: true
});

ko.components.register('carousel-module', {
    viewModel: class CarouselModuleComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.params = params;
            this.section = params.data.section;
            this.headline = params.data.headline;
            this.cta = params.data.cta;
            this.carouselModulesSections = params.data.sections;
            this.arrayContent1 = this.carouselModulesSections[0];
            this.arrayContent2 = this.carouselModulesSections[1];
            this.arrayContent3 = this.carouselModulesSections[2];
            this.arrayContent4 = this.carouselModulesSections[3];
            this.arrayContent5 = this.carouselModulesSections[4];
            this.arrayContent6 = this.carouselModulesSections[5];
            this.displayGroupViewPortSize = ko.observable();
            this.displayGroupViewPortSize(params.data.displayModuleOn);
            ko.bindingHandlers.reinit = {
                update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                    $(function () {
                        var mySwiper = new Swiper('.swiper-container', {
                            loop: true,
                            loopAdditionalSlides: 0,
                            loopedSlides: 0,
                            nextButton: '.swiper-button-next',
                            prevButton: '.swiper-button-prev',
                            slidesPerView: 5,
                            spaceBetween: 12,
                            centeredSlides: true,
                            breakpoints: {
                                1024: {
                                    slidesPerGroup: 3,
                                    slidesPerView: 3
                                },
                                640: {
                                    slidesPerGroup: 2,
                                    slidesPerView: 2
                                },
                                320: {
                                    slidesPerGroup: 2,
                                    slidesPerView: 2
                                }
                            }
                        });
                    })
                }
            };
        }
    },
    template: `
        <!-- ko if: displayOn(displayGroupViewPortSize()), resizeView: 'CL' -->
            <section data-bind="" class="carousel-module background-color-off-white">
                <div class="row fullwidth">
                    <!-- ko if: viewPortSize() === 'small' -->
                        <!-- ko if: section.text -->
                            <div class="small-12 text-center columns">
                                <label class="body-small-caps-override"><a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section', 'data-description': section.description, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></label>
                            </div>
                        <!-- /ko -->

                        <div class="small-12 text-center columns">
                            <a class="a-secondary" data-bind="attr: { href: addUgDomain(headline.link), 'data-type': 'Headline', 'data-description': headline.description, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                <h3 data-bind="html: headline.text"></h3>
                            </a>
                        </div>

                        <div class="small-12 columns carouselPadding">
                            <div class="swiper-container">
                                <div class="swiper-wrapper">
                                    <!-- ko foreach: carouselModulesSections -->
                                        <div class="swiper-slide">
                                            <a data-bind="attr: { href: addUgDomain(image.link), 'data-type': 'Image', 'data-description': image.description, 'data-itemNumber': item, 'data-cta': $parent.cta.text, 'data-sectionDescription': $parent.section.description }">
                                                <div class="responsively-lazy preventReflow">
                                                    <img data-bind="attr: { 'data-srcset': $parent.responsiveImage(item, image.customImage.large, image.customImage.small), src: image.customImage.large ? image.customImage.large : productImgPath(item,360), alt: $parent.cta.text }"/>
                                                </div>
                                            </a>
                                        </div>
                                    <!-- /ko -->
                                </div>
                                <div class="swiper-button-prev"><span class="icon-caret_left icon-lg"></span></div>
                                <div class="swiper-button-next"><span class="icon-caret_right icon-lg"></span></div>
                            </div>
                        </div>
                        <div class="small-10 small-centered columns" data-bind="reinit">
                            <a data-bind="attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                <button class="btn-secondary expand" data-bind="html: cta.text"></button>
                            </a>
                        </div>
                    <!-- /ko -->

                    <!-- ko if: viewPortSize() != 'small' -->
                        <div class="small-12 large-11 xlarge-10 xxlarge-8 large-centered columns">
                            <div class="row container">
                                <div class="small-12 medium-6 columns">
                                    <div class="flex">
                                        <div class="small-8-width">
                                            <a data-bind="attr: { href: addUgDomain(arrayContent1.image.link), 'data-type': 'Image', 'data-description': arrayContent1.image.description, 'data-itemNumber': arrayContent1.item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                <div class="responsively-lazy preventReflow">
                                                    <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent1.item, arrayContent1.image.customImage.large, arrayContent1.image.customImage.small), src: arrayContent1.image.customImage.large ? arrayContent1.image.customImage.large : productImgPath(arrayContent1.item,360), alt: cta.text }"/>
                                                </div>
                                            </a>
                                        </div>

                                        <div class="small-4-width">
                                            <div>
                                                <a data-bind="attr: { href: addUgDomain(arrayContent2.image.link), 'data-type': 'Image', 'data-description': arrayContent2.image.description, 'data-itemNumber': arrayContent2.item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                    <div class="responsively-lazy preventReflow">
                                                        <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent2.item, arrayContent2.image.customImage.large, arrayContent2.image.customImage.small), src: arrayContent2.image.customImage.large ? arrayContent2.image.customImage.large : productImgPath(arrayContent2.item,360), alt: cta.text }"/>
                                                    </div>
                                                </a>
                                            </div>
                                            <div>
                                                <a data-bind="attr: { href: addUgDomain(arrayContent3.image.link), 'data-type': 'Image', 'data-description': arrayContent3.image.description, 'data-itemNumber': arrayContent3.item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                    <div class="responsively-lazy preventReflow">
                                                        <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent3.item, arrayContent3.image.customImage.large, arrayContent3.image.customImage.small), src: arrayContent3.image.customImage.large ? arrayContent3.image.customImage.large : productImgPath(arrayContent3.item,360), alt: cta.text }"/>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="small-12 medium-6 columns">
                                    <div class="flex">
                                        <div class="small-8-width">
                                            <a data-bind="attr: { href: addUgDomain(arrayContent4.image.link), 'data-type': 'Image', 'data-description': arrayContent4.image.description, 'data-itemNumber': arrayContent4.item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                <div class="responsively-lazy preventReflow">
                                                    <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent4.item, arrayContent4.image.customImage.large, arrayContent4.image.customImage.small), src: arrayContent4.image.customImage.large ? arrayContent4.image.customImage.large : productImgPath(arrayContent4.item,360), alt: cta.text }"/>
                                                </div>
                                            </a>
                                        </div>

                                        <div class="small-4-width">
                                            <div>
                                                <a data-bind="attr: { href: addUgDomain(arrayContent5.image.link), 'data-type': 'Image', 'data-description': arrayContent5.image.description, 'data-itemNumber': arrayContent5.item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                    <div class="responsively-lazy preventReflow">
                                                        <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent5.item, arrayContent5.image.customImage.large, arrayContent5.image.customImage.small), src: arrayContent5.image.customImage.large ? arrayContent5.image.customImage.large : productImgPath(arrayContent5.item,360), alt: cta.text }"/>
                                                    </div>
                                                </a>
                                            </div>
                                            <div>
                                                <a data-bind="attr: { href: addUgDomain(arrayContent6.image.link), 'data-type': 'Image', 'data-description': arrayContent6.image.description, 'data-itemNumber': arrayContent6.item, 'data-cta': cta.text, 'data-sectionDescription': section.description }">
                                                    <div class="responsively-lazy preventReflow">
                                                        <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent6.item, arrayContent6.image.customImage.large, arrayContent6.image.customImage.small), src: arrayContent6.image.customImage.large ? arrayContent6.image.customImage.large : productImgPath(arrayContent6.item,360), alt: cta.text }"/>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="small-12 columns">
                                    <div class="row">
                                        <div class="medium-8 large-6 medium-centered columns">
                                            <div class="white-box-container text-center">
                                                <!-- ko if: section.text -->
                                                    <label class="body-small-caps-override"><a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section', 'data-description': section.description, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></label>
                                                <!-- /ko -->
                                                <a data-bind="attr: { href: addUgDomain(headline.link), 'data-type': 'Headline', 'data-description': headline.description, 'data-cta': cta.text, 'data-sectionDescription': section.description }"><h1 data-bind="html: headline.text"></h1></a>
                                                <p class="body-small-override"><a data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-cta': cta.text, 'data-sectionDescription': section.description }"></a></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <!-- /ko -->
                </div>
            </section>
        <!-- /ko -->`, synchronous: true
});

ko.components.register('text-link-module', {
    viewModel: class TextLinkModuleComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.params = params;
            this.section = params.data.section;
            this.textLinkModuleSections = params.data.sections;
            this.nonHiddenModuleSections = [];
            this.displayGroupViewPortSize = ko.observable();
            this.displayGroupViewPortSize(this.displayGroup(this.textLinkModuleSections));
        }
    },
    template: `
        <!-- ko if: displayOn(displayGroupViewPortSize()), resizeView: 'TL' -->
            <section data-bind="" class="text-link-module background-color-off-white">
                <div class="row fullwidth waterColor">
                    <div class="small-12 large-11 xlarge-10 xxlarge-8 small-centered columns container">
                        <!-- ko if: section.text -->
                            <div class="row">
                                <div class="small-12 text-center columns">
                                    <h2>
                                        <a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section', 'data-description': section.description, 'data-sectionDescription': section.description }"></a>
                                    </h2>
                                </div>
                            </div>
                        <!-- /ko -->

                        <!-- ko if: viewPortSize() === 'small' -->
                            <div class="row">
                                <!-- ko foreach: textLinkModuleSections -->
                                    <!-- ko if: $parent.displayOn(displayModuleOn) -->
                                        <div class="small-6 columns">
                                            <div class="text-link-container">
                                                <div class="content">
                                                    <h4>
                                                        <a class="a-secondary" data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': $parent.section.description }"></a>
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    <!-- /ko -->
                                <!-- /ko -->
                            </div>
                        <!-- /ko -->

                        <!-- ko if: viewPortSize() != 'small' -->
                            <div class="row">
                                <div class="medium-12 columns">
                                    <!-- ko foreach: textLinkModuleSections -->
                                        <!-- ko if: $parent.displayOn(displayModuleOn) -->
                                            <div data-bind="attr: { class: $parent.classNameBlockGrid($parent.textLinkModuleSections) + ' productContainer text-center content' }">
                                                <div class="responsively-lazy preventReflow">
                                                    <a data-bind="attr: { href: addUgDomain(image.link), 'data-type': 'Image', 'data-description': image.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': $parent.section.description }">
                                                        <img data-bind="attr: { 'data-srcset': $parent.responsiveImage(item, image.customImage.large, image.customImage.small), src: image.customImage.large ? image.customImage.large : productImgPath(item,640), alt: cta.text }"/>
                                                    </a>
                                                </div>
                                                <a class="a-secondary" data-bind="attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': $parent.section.description }">
                                                    <h4 data-bind="html: cta.text"></h4>
                                                </a>
                                            </div>
                                        <!-- /ko -->
                                    <!-- /ko -->
                                </div>
                            </div>
                        <!-- /ko -->
                    </div>
                </div>
            </section>
        <!-- /ko -->`, synchronous: true
});

ko.components.register('image-link-double-module', {
    viewModel: class ImageLinkDoubleModuleComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.params = params;
            this.section = params.data.section;
            this.imageLinkDoubleModuleSections = params.data.sections;
            this.nonHiddenModuleSections = [];
            this.displayGroupViewPortSize = ko.observable();
            this.displayGroupViewPortSize(this.displayGroup(this.imageLinkDoubleModuleSections));
        }
    },
    template: `
        <!-- ko if: displayOn(displayGroupViewPortSize()), resizeView: 'LD' -->
            <section data-bind="" class="image-link-double-module background-color-off-white">
                <div class="row fullwidth waterColor">
                    <div class="small-12 large-11 xlarge-10 xxlarge-8 small-centered columns container">
                        <!-- ko if: section.text -->
                            <div class="row">
                                <div class="small-12 xlarge-10 xxlarge-8 text-center xlarge-centered columns">
                                    <h2>
                                        <a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section', 'data-description': section.description, 'data-sectionDescription': section.description }"></a>
                                    </h2>
                                </div>
                            </div>
                        <!-- /ko -->
                        <div class="row">
                            <div class="small-11 medium-12 small-centered columns">
                                <!-- ko foreach: imageLinkDoubleModuleSections -->
                                    <!-- ko if: $parent.displayOn(displayModuleOn) -->
                                        <div data-bind="attr: { class: $parent.classNameBlockGrid($parent.imageLinkDoubleModuleSections) + ' productContainer text-center' }">
                                            <div class="responsively-lazy preventReflow">
                                                <a data-bind="attr: { href: addUgDomain(image.link), 'data-type': 'Image', 'data-description': image.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': $parent.section.description }">
                                                    <img data-bind="attr: { 'data-srcset': $parent.responsiveImage(item, image.customImage.large, image.customImage.small), src: image.customImage.large ? image.customImage.large : productImgPath(item,640), alt: cta.text }"/>
                                                </a>
                                            </div>
                                            <h4><a class="a-secondary" data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': $parent.section.description }"></a></h4>
                                        </div>
                                    <!-- /ko -->
                                <!-- /ko -->
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        <!-- /ko -->`, synchronous: true
    });

ko.components.register('button-link-double-module', {
    viewModel: class ButtonLinkDoubleModuleComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.params = params;
            this.section = params.data.section;
            this.buttonLinkDoubleModuleSections = params.data.sections;
            this.arrayContent1 = this.buttonLinkDoubleModuleSections[0];
            this.arrayContent2 = this.buttonLinkDoubleModuleSections[1];
            this.arrayContent3 = this.buttonLinkDoubleModuleSections[2];
            this.arrayContent4 = this.buttonLinkDoubleModuleSections[3];
            this.arrayContent5 = this.buttonLinkDoubleModuleSections[4];
            this.arrayContent6 = this.buttonLinkDoubleModuleSections[5];
            this.displayGroupViewPortSize = ko.observable();
            this.displayGroupViewPortSize(this.displayGroup(this.buttonLinkDoubleModuleSections));
            this.nonHiddenModuleSections = [];
            this.shouldStack = function() {
                return this.viewPortSize() === 'xlarge' && this.buttonLinkDoubleModuleSections.length === 6 ? true : false;
            }
            this.showBtnContainerInside = function() {
                return this.viewPortSize() != 'small' && this.buttonLinkDoubleModuleSections.length === 4 || this.viewPortSize() === 'medium' && this.buttonLinkDoubleModuleSections.length === 6 ? true : false;
            }
            this.showBtnContainerHanging = function() {
                return this.viewPortSize() === 'small' || this.viewPortSize() === 'large' && this.buttonLinkDoubleModuleSections.length === 6 ? true : false;
            }
        }
    },
    template: `
        <!-- ko if: displayOn(displayGroupViewPortSize()), resizeView: 'BD' -->
            <section data-bind="" class="button-link-double-module background-color-white">

                <div class="row">
                    <div class="small-12 columns">
                        <div class="row collapse">
                            <div class="small-8 medium-10 large-8 small-centered columns">
                                <hr class="dottedSpacer">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ko if: section.text -->
                    <div class="row">
                        <div class="small-12 small-centered text-center columns">
                            <h2>
                                <a class="a-secondary" data-bind="html: section.text, attr: { href: addUgDomain(section.link), 'data-type': 'Section', 'data-description': section.description, 'data-sectionDescription': section.description }"></a>
                            </h2>
                        </div>
                    </div>
                <!-- /ko -->

                <!-- ko if: !shouldStack() -->
                    <div class="row fullwidth">
                        <div class="small-12 large-11 xlarge-10 xxlarge-8 large-centered columns">
                            <!-- ko foreach: buttonLinkDoubleModuleSections -->
                                <!-- ko if: $parent.displayOn(displayModuleOn) -->
                                    <div data-bind="attr: { class: $parent.classNameBlockGrid($parent.buttonLinkDoubleModuleSections) + ' productContainer' }">
                                        <div class="responsively-lazy preventReflow">
                                            <a data-bind="attr: { href: addUgDomain(image.link), 'data-type': 'Image', 'data-description': image.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': $parent.section.description }">
                                                <img data-bind="attr: { src: image.customImage.large ? image.customImage.large : productImgPath(item,640), 'data-srcset': $parent.responsiveImage(item, image.customImage.large, image.customImage.small),  alt: cta.text }"/>
                                            </a>
                                            <!-- ko if: $parent.showBtnContainerInside() -->
                                                <div class="btnContainerInside">
                                                    <a data-bind="attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': $parent.section.description }">
                                                        <button class="btn-secondary expand" data-bind="html: cta.text"></button>
                                                    </a>
                                                </div>
                                            <!-- /ko -->
                                        </div>
                                        <!-- ko if: $parent.showBtnContainerHanging() -->
                                            <div class="btnContainerHanging">
                                                <a data-bind="attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': $parent.section.description }">
                                                    <button class="btn-secondary expand" data-bind="html: cta.text"></button>
                                                </a>
                                            </div>
                                        <!-- /ko -->
                                    </div>
                                <!-- /ko -->
                            <!-- /ko -->
                        </div>
                    </div>
                <!-- /ko -->

                <!-- ko if: shouldStack() -->
                    <div class="row fullwidth">
                        <div class="xlarge-10 xxlarge-8 xlarge-centered columns stackedMargin">
                            <div class="row">
                                <div class="small-12 medium-6 columns">
                                    <div class="row">
                                        <div class="xlarge-8 columns">
                                            <div class="responsively-lazy preventReflow">
                                                <a data-bind="attr: { href: addUgDomain(arrayContent1.image.link), 'data-type': 'Image', 'data-description': arrayContent1.image.description }">
                                                    <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent1.item, arrayContent1.image.customImage.large, arrayContent1.image.customImage.small), src: arrayContent1.image.customImage.large ? arrayContent1.image.customImage.large : productImgPath(arrayContent1.item,360), alt: arrayContent1.cta.text }"/>
                                                </a>
                                                <div class="btnContainerInside">
                                                    <a data-bind="attr: { href: addUgDomain(arrayContent1.cta.link), 'data-type': 'CTA', 'data-description': arrayContent1.cta.description }">
                                                        <button class="btn-secondary expand" data-bind="html: arrayContent1.cta.text"></button>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="xlarge-4 columns">
                                            <div class="colBottomPadding">
                                                <div class="responsively-lazy preventReflow">
                                                    <a data-bind="attr: { href: addUgDomain(arrayContent2.image.link), 'data-type': 'Image', 'data-description': arrayContent2.image.description }">
                                                        <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent2.item, arrayContent2.image.customImage.large, arrayContent2.image.customImage.small), src: arrayContent2.image.customImage.large ? arrayContent2.image.customImage.large : productImgPath(arrayContent2.item,360), alt: arrayContent2.cta.text }"/>
                                                    </a>
                                                    <div class="btnContainerInside">
                                                        <a data-bind="attr: { href: addUgDomain(arrayContent2.cta.link), 'data-type': 'CTA', 'data-description': arrayContent2.cta.description }">
                                                            <button class="btn-secondary expand" data-bind="html: arrayContent2.cta.text"></button>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="responsively-lazy preventReflow">
                                                    <a data-bind="attr: { href: addUgDomain(arrayContent3.image.link), 'data-type': 'Image', 'data-description': arrayContent3.image.description }">
                                                        <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent3.item, arrayContent3.image.customImage.large, arrayContent3.image.customImage.small), src: arrayContent3.image.customImage.large ? arrayContent3.image.customImage.large : productImgPath(arrayContent3.item,360), alt: arrayContent3.cta.text }"/>
                                                    </a>
                                                    <div class="btnContainerInside">
                                                        <a data-bind="attr: { href: addUgDomain(arrayContent3.cta.link), 'data-type': 'CTA', 'data-description': arrayContent3.cta.description }">
                                                            <button class="btn-secondary expand" data-bind="html: arrayContent3.cta.text"></button>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="small-12 medium-6 columns">
                                    <div class="row">
                                        <div class="xlarge-8 columns">
                                            <div class="responsively-lazy preventReflow">
                                                <a data-bind="attr: { href: addUgDomain(arrayContent4.image.link), 'data-type': 'Image', 'data-description': arrayContent4.image.description }">
                                                    <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent4.item, arrayContent4.image.customImage.large, arrayContent4.image.customImage.small), src: arrayContent4.image.customImage.large ? arrayContent4.image.customImage.large : productImgPath(arrayContent4.item,360), alt: arrayContent4.cta.text }"/>
                                                </a>
                                                <div class="btnContainerInside">
                                                    <a data-bind="attr: { href: addUgDomain(arrayContent4.cta.link), 'data-type': 'CTA', 'data-description': arrayContent4.cta.description }">
                                                        <button class="btn-secondary expand" data-bind="html: arrayContent4.cta.text"></button>
                                                    </a>
                                                </div>
                                            </div>
                                            </a>
                                        </div>
                                        <div class="xlarge-4 columns">
                                            <div class="colBottomPadding">
                                                <div class="responsively-lazy preventReflow">
                                                    <a data-bind="attr: { href: addUgDomain(arrayContent5.image.link), 'data-type': 'Image', 'data-description': arrayContent5.image.description }">
                                                        <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent5.item, arrayContent5.image.customImage.large, arrayContent5.image.customImage.small), src: arrayContent5.image.customImage.large ? arrayContent5.image.customImage.large : productImgPath(arrayContent5.item,360), alt: arrayContent5.cta.text }"/>
                                                    </a>
                                                    <div class="btnContainerInside">
                                                        <a data-bind="attr: { href: addUgDomain(arrayContent5.cta.link), 'data-type': 'CTA', 'data-description': arrayContent5.cta.description }">
                                                            <button class="btn-secondary expand" data-bind="html: arrayContent5.cta.text"></button>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="responsively-lazy preventReflow">
                                                    <a data-bind="attr: { href: addUgDomain(arrayContent6.image.link), 'data-type': 'Image', 'data-description': arrayContent6.image.description }">
                                                        <img data-bind="attr: { 'data-srcset': responsiveImage(arrayContent6.item, arrayContent6.image.customImage.large, arrayContent6.image.customImage.small), src: arrayContent6.image.customImage.large ? arrayContent6.image.customImage.large : productImgPath(arrayContent6.item,360), alt: arrayContent6.cta.text }"/>
                                                    </a>
                                                    <div class="btnContainerInside">
                                                        <a data-bind="attr: { href: addUgDomain(arrayContent3.cta.link), 'data-type': 'CTA', 'data-description': arrayContent6.cta.description }">
                                                            <button class="btn-secondary expand" data-bind="html: arrayContent3.cta.text"></button>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <!-- /ko -->

                <div class="row">
                    <div class="small-12 columns">
                        <div class="row collapse">
                            <div class="small-8 medium-10 large-8 small-centered columns">
                                <hr class="dottedSpacer">
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        <!-- /ko -->`, synchronous: true
});

ko.components.register('seo-link-module', {
    viewModel: class SeoLinkModuleComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.params = params;
            this.seo1 = params.data.seo1;
            this.seo1Sections = params.data.seo1.sections;
            this.seo2 = params.data.seo2;
            this.seo2Sections = params.data.seo2.sections;
            this.displayGroupViewPortSize = ko.observable('small');
        }
    },
    template: `
        <!-- ko if: displayOn(displayGroupViewPortSize()), resizeView: 'TL_SEO' -->
            <section data-bind="" class="seoLinks text-link-module background-color-off-white">
                <!-- ko if: viewPortSize() === 'small' -->
                    <div class"row">
                        <div class="small-12 small-centered columns container">
                            <!-- ko if: seo1.section.text -->
                                <div class="row">
                                    <div class="small-12 text-center columns">
                                        <h2>
                                            <a class="a-secondary" data-bind="html: seo1.section.text, attr: { href: addUgDomain(seo1.section.link), 'data-type': 'Section', 'data-description': seo1.section.description, 'data-sectionDescription': seo1.section.description  }"></a>
                                        </h2>
                                    </div>
                                </div>
                            <!-- /ko -->
                            <div class="row">
                                <!-- ko foreach: seo1Sections -->
                                    <div class="small-6 columns">
                                        <div class="text-link-container">
                                            <div class="content"><h4><a class="a-secondary" data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-cta': cta.text, 'data-sectionDescription': $parent.seo1.section.description }"></a></h4></div>
                                        </div>
                                    </div>
                                <!-- /ko -->
                            </div>
                        </div>
                    </div>

                    <div class="seoLinks2 image-link-double-module background-color-off-white">
                        <div class="row container">
                            <div class="small-12 small-centered columns">
                                <!-- ko if: seo2.section.text -->
                                    <div class="row">
                                        <div class="small-12 xlarge-10 text-center xlarge-centered columns">
                                            <h2>
                                                <a class="a-secondary" data-bind="html: seo2.section.text, attr: { href: addUgDomain(seo2.section.link), 'data-type': 'Section', 'data-description': seo2.section.description, 'data-sectionDescription': seo2.section.description }"></a>
                                            </h2>
                                        </div>
                                    </div>
                                <!-- /ko -->
                            </div>

                            <div class="small-11 small-centered columns">
                                <div class="row">
                                    <!-- ko foreach: seo2Sections -->
                                        <div data-bind="attr: { class: $parent.classNameBlockGrid($parent.seo2Sections) + ' productContainer text-center content' }">
                                            <div class="responsively-lazy preventReflow">
                                                <a data-bind="attr: { href: addUgDomain(image.link), 'data-type': 'Image', 'data-description': image.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': $parent.seo2.section.description}">
                                                    <img data-bind="attr: { 'data-srcset': $parent.responsiveImage(item, image.customImage.large, image.customImage.small), src: image.customImage.large ? image.customImage.large : productImgPath(item,640), alt: cta.text }"/>
                                                </a>
                                            </div>
                                            <h4><a class="a-secondary" data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-itemNumber': item, 'data-cta': cta.text, 'data-sectionDescription': $parent.seo2.section.description }"></a></h4>
                                        </div>
                                    <!-- /ko -->
                                </div>
                            </div>
                        </div>
                    </div>
                <!-- /ko -->

                <!-- ko if: viewPortSize() != 'small' -->
                    <div class="row fullwidth seo1LinksContainer">
                        <div class="small-12 columns">
                            <div class="row topSpacer">
                                <div class="small-12 columns">
                                    <div class="row collapse">
                                        <div class="small-6 medium-10 large-8 small-centered columns" style="width: 372px;">
                                            <hr class="dottedSpacer">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="small-12 text-center columns">
                                    <div>
                                        <div class="topCatContent">
                                            <span data-bind="html: seo1.section.text"></span>
                                            <div class="displayInline">
                                                <!-- ko foreach: seo1Sections -->
                                                    <a data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-cta': cta.text, 'data-sectionDescription': $parent.seo1.section.description }" class="body-small-crumbs"></a>
                                                <!-- /ko -->
                                            </div>
                                        </div>

                                        <div>
                                            <span data-bind="html: seo2.section.text"></span>
                                            <div class="displayInline">
                                                <!-- ko foreach: seo2Sections -->
                                                    <a data-bind="html: cta.text, attr: { href: addUgDomain(cta.link), 'data-type': 'CTA', 'data-description': cta.description, 'data-cta': cta.text, 'data-sectionDescription': $parent.seo2.section.description }" class="body-small-crumbs"></a>
                                                <!-- /ko -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row bottomSpacer">
                                <div class="small-12 columns">
                                    <div class="row collapse">
                                        <div class="small-6 medium-10 large-8 small-centered columns" style="width: 372px;">
                                            <hr class="dottedSpacer">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <!-- /ko -->
            </section>
        <!-- /ko -->`, synchronous: true
});

ko.components.register('homePage-container', {

    viewModel: class HomePageContainerComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.seoLinks = params.seoLinks;
            this.totalModules = Object.keys(mappingOrder).length;
            Object.keys(mappingOrder).forEach((letter, i) => {
                Object.keys(mappingOrder[letter]).forEach((module, index) => {
                    mappingOrder[letter][module]['index'] = i;
                })
            });
        }
    },
    template: `
        <!--ko foreach: { data: Object.keys(mappingOrder) } -->
            <!-- ko component: {name: Object.keys(mappingOrder[$data])[0], params:{data:mappingOrder[$data][Object.keys(mappingOrder[$data])], parent:$parent }} --><!-- /ko -->
        <!-- /ko -->`, synchronous: true
});

ko.applyBindings();
