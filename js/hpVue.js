var displayGroupMixin = {
    methods: {
        displayGroup: function (arry) {
            var sectionArray = [];
            arry.forEach(function (el, i) {
                sectionArray.push(el.displayModuleOn);
            });
            if (sectionArray.indexOf('small') > -1) {
                return 'small';
            }
            else if (sectionArray.indexOf('medium') > -1) {
                return 'medium';
            }
            else if (sectionArray.indexOf('large') > -1) {
                return 'large';
            }
            else {
                return 'xlarge';
            }
        }
    }
};
var displayOnMixin = {
    methods: {
        displayOn: function (displayModuleOn, viewPortSize) {
            return {
                'small': viewPortSize === 'small' || viewPortSize === 'medium' || viewPortSize === 'large' || viewPortSize === 'xlarge' ? true : false,
                'medium': viewPortSize === 'medium' || viewPortSize === 'large' || viewPortSize === 'xlarge' ? true : false,
                'large': viewPortSize === 'large' || viewPortSize === 'xlarge' ? true : false,
                'xlarge': viewPortSize === 'xlarge' ? true : false
            }[displayModuleOn];
        }
    }
};
var productImgPathMixin = {
    methods: {
        productImgPath: function (itemId, size) {
            var itemDir = 'https://www.uncommongoods.com/images/items/';
            var itemIdTrim = itemId.toString().slice(0, -2);
            if (size === 640) {
                return itemDir + itemIdTrim + '00/' + itemId + '_1_640px.jpg';
            }
            if (size === 360) {
                return itemDir + itemIdTrim + '00/' + itemId + '_1_360px.jpg';
            }
        }
    }
};
var responsiveImageMixin = {
    // mixins: [productImgPathMixin],
    methods: {
        responsiveImage: function (itemId, largeImage, smallImage) {
            var responsiveValue;
            var largeImageSize = largeImage.split('_').pop().split('.')[0].slice(0, -2);
            var smallImageSize = smallImage.split('_').pop().split('.')[0].slice(0, -2);
            responsiveValue = smallImageSize ? smallImage + ' ' + smallImageSize + 'w, ' : this.productImgPath(itemId, 360) + ' 360w, ';
            responsiveValue += largeImageSize ? largeImage + ' ' + largeImageSize + 'w' : this.productImgPath(itemId, 640) + ' 640w';
            return responsiveValue;
        }
    }
};
var classNameBlockGridMixin = {
    methods: {
        classNameBlockGrid: function (sectionData, viewPortSize) {
            var nonHiddenModuleSections = [];
            if (viewPortSize === 'small') {
                return 'small-6 columns';
            }
            else if (viewPortSize === 'medium') {
                sectionData.forEach(function (module, index) {
                    if (module.displayModuleOn === 'small' || module.displayModuleOn === 'medium') {
                        nonHiddenModuleSections.push(module.displayModuleOn);
                    }
                });
                return {
                    '4': 'medium-3 columns',
                    '6': 'medium-2 columns'
                }[nonHiddenModuleSections.length];
            }
            else if (viewPortSize === 'large') {
                sectionData.forEach(function (module, index) {
                    if (module.displayModuleOn === 'small' || module.displayModuleOn === 'medium' || module.displayModuleOn === 'large') {
                        nonHiddenModuleSections.push(module.displayModuleOn);
                    }
                });
                return {
                    '4': 'large-3 columns',
                    '6': 'large-2 columns'
                }[nonHiddenModuleSections.length];
            }
            else {
                sectionData.forEach(function (module, index) {
                    if (module.displayModuleOn === 'small' || module.displayModuleOn === 'medium' || module.displayModuleOn === 'large' || module.displayModuleOn === 'xlarge') {
                        nonHiddenModuleSections.push(module.displayModuleOn);
                    }
                });
                return {
                    '4': 'medium-3 columns',
                    '6': 'medium-2 columns'
                }[nonHiddenModuleSections.length];
            }
        }
    }
};
Vue.component('large-feature-module', {
    mixins: [displayGroupMixin, displayOnMixin, productImgPathMixin],
    props: ['moduleData', 'viewportSize'],
    data: function () {
        return {
            largeFeatureModulesSections: this.moduleData.sections,
            displayGroupViewPortSize: null
        };
    },
    created: function () {
        this.displayGroupViewPortSize = this.displayGroup(this.largeFeatureModulesSections);
    },
    methods: {
        isVideo: function (video) {
            return video.split('.').pop() === 'mp4' ? true : false;
        },
        posterImage: function (videoFile) {
            return videoFile.split('.').shift() + '.jpg';
        }
    },
    template: "\n        <section v-if=\"displayOn(displayGroupViewPortSize, viewportSize)\" class=\"large-feature-module background-color-off-white\">\n            <template v-for=\"item in largeFeatureModulesSections\">\n                <template v-if=\"displayOn(item.displayModuleOn, viewportSize)\">\n                    <div class=\"row fullwidth\">\n                        <div class=\"small-12 large-11 xlarge-10 xxlarge-8 large-centered columns\">\n                            <a v-bind:href=\"item.image.link\" v-bind:data-description=\"item.image.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" data-type=\"Image\">\n                                <picture>\n                                    <!--[if IE 9]><video style=\"display: none;\"><![endif]-->\n                                        <source v-bind:srcset=\"item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,640)\"/>\n                                        <source v-bind:srcset=\"item.image.customImage.small ? item.image.customImage.small : productImgPath(item.item,360)\"/>\n                                    <!--[if IE 9]></video><![endif]-->\n\n                                    <template v-if=\"viewportSize === 'small'\">\n                                        <div class=\"responsively-lazy preventReflow\">\n                                            <p v-html=\"item.image.customImage.small\"></p>\n                                            <img v-bind:src=\"item.image.customImage.small ? item.image.customImage.small : productImgPath(item,360)\" v-bind:alt=\"item.cta.text\">\n                                        </div>\n                                    </template>\n\n                                    <template v-if=\"viewportSize != 'small'\">\n                                        <template v-if=\"isVideo(item.image.customImage.large)\">\n                                            <video loop muted autoplay v-bind:poster=\"posterImage(item.image.customImage.large)\">\n                                                <source v-bind:src=\"item.image.customImage.large\" type=\"video/mp4\">\n                                                <source v-bind:src=\"item.image.customImage.large\" type=\"video/webm\">\n                                            </video>\n                                        </template>\n\n                                        <template v-if=\"!isVideo(item.image.customImage.large)\">\n                                            <div class=\"responsively-lazy preventReflow\">\n                                                <div v-bind:style=\"{ backgroundImage: 'url( '+ item.image.customImage.large  +' )' }\" class=\"LF_backgroundImage\"></div>\n                                            </div>\n                                        </template>\n                                    </template>\n                                </picture>\n\n                                <div class=\"row fullwidth\">\n                                    <div class=\"small-12 medium-8 large-6 small-centered columns\">\n                                        <div class=\"white-box-container text-center\">\n                                            <a class=\"a-secondary\" v-bind:href=\"item.headline.link\" v-bind:data-description=\"item.headline.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" data-type=\"Headline\">\n                                                <h1 v-html=\"item.headline.text\"></h1>\n                                            </a>\n                                            <a class=\"button btn-secondary\" v-html=\"item.cta.text\" v-bind:href=\"item.cta.link\" v-bind:data-description=\"item.cta.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" data-type=\"CTA\"></a>\n                                        </div>\n                                    </div>\n                                </div>\n                            </a>\n                        </div>\n                    </div>\n                </template>\n            </template>\n        </section>"
});
Vue.component('small-feature-module', {
    mixins: [displayGroupMixin, displayOnMixin, productImgPathMixin, responsiveImageMixin],
    props: ['moduleData', 'viewportSize'],
    data: function () {
        return {
            smModulesSections: this.moduleData.sections,
            displayGroupViewPortSize: null
        };
    },
    created: function () {
        this.displayGroupViewPortSize = this.displayGroup(this.smModulesSections);
    },
    methods: {
        isEven: function (index) {
            return index % 2 === 0 ? true : false;
        },
        className: function (sectionData) {
            var nonHiddenModuleSections = [];
            if (this.viewportSize === 'large') {
                sectionData.forEach(function (module, index) {
                    if (module.displayModuleOn === 'small' || module.displayModuleOn === 'medium' || module.displayModuleOn === 'large') {
                        nonHiddenModuleSections.push(module.displayModuleOn);
                    }
                });
                return {
                    '2': 'large-6 columns',
                    '3': 'large-4 columns',
                    '4': 'large-6 columns'
                }[nonHiddenModuleSections.length];
            }
            else {
                sectionData.forEach(function (module, index) {
                    if (module.displayModuleOn === 'small' || module.displayModuleOn === 'medium' || module.displayModuleOn === 'large' || module.displayModuleOn === 'xlarge') {
                        nonHiddenModuleSections.push(module.displayModuleOn);
                    }
                });
                return {
                    '2': 'large-6 columns',
                    '3': 'large-4 columns',
                    '4': 'large-6 columns'
                }[nonHiddenModuleSections.length];
            }
        }
    },
    template: "\n        <section v-if=\"displayOn(displayGroupViewPortSize, viewportSize)\" class=\"small-feature-module background-color-white\">\n            <template v-if=\"viewportSize === 'small' || viewportSize === 'medium'\">\n                <template v-for=\"(item, index) in smModulesSections\">\n                    <template v-if=\"displayOn(item.displayModuleOn, viewportSize)\">\n                        <template v-if=\"isEven(index)\">\n                            <div class=\"row fullwidth\">\n                                <div class=\"container\">\n                                    <div class=\"small-6 medium-7 columns\">\n                                        <div v-bind:style=\"{ margin: viewportSize === 'medium' ? '-1.5rem 0 0 -1.5rem' : '0' }\">\n                                            <a v-bind:href=\"item.image.link\" v-bind:data-description=\"item.image.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"item.section.description\" data-type=\"Image\">\n                                                <div class=\"responsively-lazy preventReflow\">\n                                                    <img class=\"right\" v-bind:data-srcset=\"responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)\" v-bind:src=\"item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,360)\" v-bind:alt=\"item.cta.text\"/>\n                                                </div>\n                                            </a>\n                                        </div>\n                                    </div>\n                                    <div class=\"small-6 medium-5 columns text-center\">\n                                        <div class=\"copyContainer\">\n                                            <label v-if=\"item.section.text\" class=\"body-small-caps-override\">\n                                                <a class=\"a-secondary\" v-html=\"item.section.text\" v-bind:href=\"item.section.link\" v-bind:data-description=\"item.section.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"item.section.description\" data-type=\"Section\"></a>\n                                            </label>\n\n                                            <a v-bind:href=\"item.headline.link\" v-bind:data-description=\"item.headline.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"item.section.descriptio\" data-type=\"Headline\">\n                                                <h3 v-html=\"item.headline.text\"></h3>\n                                            </a>\n\n                                            <p class=\"body-small-override\">\n                                                <a v-html=\"item.cta.text\" v-bind:href=\"item.cta.link\" v-bind:data-description=\"item.cta.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" data-type=\"CTA\"></a>\n                                            </p>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </template>\n\n                        <template v-if=\"!isEven(index)\">\n                            <div class=\"row fullwidth\">\n                                <div class=\"container\">\n                                    <div class=\"small-6 medium-5 columns text-center\">\n                                        <div class=\"copyContainer\">\n                                            <label v-if=\"item.section.text\" class=\"body-small-caps-override\">\n                                                <a class=\"a-secondary\" v-html=\"item.section.text\" v-bind:href=\"item.section.link\" v-bind:data-description=\"item.section.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"item.section.description\" data-type=\"Section\"></a>\n                                            </label>\n\n                                            <a v-bind:href=\"item.headline.link\" v-bind:data-description=\"item.headline.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"item.section.descriptio\" data-type=\"Headline\">\n                                                <h3 v-html=\"item.headline.text\"></h3>\n                                            </a>\n\n                                            <p class=\"body-small-override\">\n                                                <a v-html=\"item.cta.text\" v-bind:href=\"item.cta.link\" v-bind:data-description=\"item.cta.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" data-type=\"CTA\"></a>\n                                            </p>\n                                        </div>\n                                    </div>\n                                    <div class=\"small-6 medium-7 columns\">\n                                        <div v-bind:style=\"{ margin: viewportSize === 'medium' ? '-1.5rem 0 0 -1.5rem' : '0' }\">\n                                            <a v-bind:href=\"item.image.link\" v-bind:data-description=\"item.image.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"item.section.description\" data-type=\"Image\">\n                                                <div class=\"responsively-lazy preventReflow\">\n                                                    <img class=\"right\" v-bind:data-srcset=\"responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)\" v-bind:src=\"item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,360)\" v-bind:alt=\"item.cta.text\"/>\n                                                </div>\n                                            </a>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </template>\n                    </template>\n                </template>\n            </template>\n\n            <template v-if=\"viewportSize === 'large' || viewportSize === 'xlarge'\">\n                <div class=\"row fullwidth\">\n                    <div class=\"large-11 xlarge-10 xxlarge-8 large-centered columns\">\n                        <div class=\"row fullwidth\">\n                            <template v-for=\"(item, index) in smModulesSections\">\n                                <template v-if=\"displayOn(item.displayModuleOn, viewportSize)\">\n                                    <div v-bind:class=\"className(smModulesSections)\">\n                                        <a v-bind:href=\"item.image.link\" v-bind:data-description=\"item.image.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"item.section.description\" data-type=\"Image\">\n                                            <div class=\"responsively-lazy preventReflow\">\n                                                <img class=\"right\" v-bind:data-srcset=\"responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)\" v-bind:src=\"item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,360)\" v-bind:alt=\"item.cta.text\"/>\n                                            </div>\n                                        </a>\n                                        <div class=\"row\">\n                                            <div class=\"large-12 large-centered columns\">\n                                                <div class=\"white-box-container text-center\">\n                                                    <label v-if=\"item.section.text\" class=\"body-small-caps-override\">\n                                                        <a class=\"a-secondary\" v-html=\"item.section.text\" v-bind:href=\"item.section.link\" v-bind:data-description=\"item.section.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"item.section.description\" data-type=\"Section\"></a>\n                                                    </label>\n                                                    <a v-bind:href=\"item.headline.link\" v-bind:data-description=\"item.headline.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"item.section.description\" data-type=\"Headline\">\n                                                        <h2 v-html=\"item.headline.text\"></h2>\n                                                    </a>\n                                                    <p class=\"body-small-override\">\n                                                        <a v-html=\"item.cta.text\" v-bind:href=\"item.cta.link\" v-bind:data-description=\"item.cta.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"item.section.description\" data-type=\"CTA\"></a>\n                                                    </p>\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </template>\n                            </template>\n                        </div>\n                    </div>\n                </div>\n            </template>\n        </section>"
});
Vue.component('basic-story-module', {
    template: "\n        <section class=\"basic-story-module background-color-off-white\">\n            basic-story-module\n        </section>\n    "
});
Vue.component('extended-story-module', {
    template: "\n        <section class=\"extended-story-module background-color-off-white\">\n            extended-story-module\n        </section>\n    "
});
Vue.component('collection-grid-module', {
    mixins: [displayGroupMixin, displayOnMixin, productImgPathMixin, responsiveImageMixin],
    props: ['moduleData', 'viewportSize'],
    data: function () {
        return {
            section: this.moduleData.section,
            headline: this.moduleData.headline,
            cta: this.moduleData.cta,
            collectionGridModulesSections: this.moduleData.sections,
            arrayContent1: null,
            arrayContent2: null,
            arrayContent3: null,
            arrayContent4: null,
            arrayContent5: null,
            arrayContent6: null,
            displayGroupViewPortSize: null
        };
    },
    created: function () {
        this.displayGroupViewPortSize = this.moduleData.displayModuleOn;
        this.arrayContent1 = this.collectionGridModulesSections[0];
        this.arrayContent2 = this.collectionGridModulesSections[1];
        this.arrayContent3 = this.collectionGridModulesSections[2];
        this.arrayContent4 = this.collectionGridModulesSections[3];
        this.arrayContent5 = this.collectionGridModulesSections[4];
        this.arrayContent6 = this.collectionGridModulesSections[5];
    },
    template: "\n        <section v-if=\"displayOn(displayGroupViewPortSize, viewportSize)\" class=\"collection-grid-module background-color-off-white\">\n            <div class=\"row fullwidth\">\n                <div class=\"small-12 large-11 xlarge-10 xxlarge-8 large-centered columns\">\n                    <div class=\"row container\">\n                        <div class=\"small-12 medium-6 columns\">\n                            <div class=\"flex\">\n                                <div class=\"small-8-width\">\n                                    <a v-bind:href=\"arrayContent1.image.link\" v-bind:data-description=\"arrayContent1.image.description\" v-bind:data-itemNumber=\"arrayContent1.item\" v-bind:data-cta=\"cta.text\" v-bind:data-sectionDescription=\"section.description\" data-type=\"Image\">\n                                        <div class=\"responsively-lazy preventReflow\">\n                                            <img v-bind:data-srcset=\"responsiveImage(arrayContent1.item, arrayContent1.image.customImage.large, arrayContent1.image.customImage.small)\" v-bind:src=\"arrayContent1.image.customImage.large ? arrayContent1.image.customImage.large : productImgPath(arrayContent1.item,360)\" v-bind:alt=\"cta.text\"/>\n                                        </div>\n                                    </a>\n                                </div>\n                                <div class=\"small-4-width\">\n                                    <div>\n                                        <a v-bind:href=\"arrayContent2.image.link\" v-bind:data-description=\"arrayContent2.image.description\" v-bind:data-itemNumber=\"arrayContent2.item\" v-bind:data-cta=\"cta.text\" v-bind:data-sectionDescription=\"section.description\" data-type=\"Image\">\n                                            <div class=\"responsively-lazy preventReflow\">\n                                                <img v-bind:data-srcset=\"responsiveImage(arrayContent2.item, arrayContent2.image.customImage.large, arrayContent2.image.customImage.small)\" v-bind:src=\"arrayContent2.image.customImage.large ? arrayContent2.image.customImage.large : productImgPath(arrayContent2.item,360)\" v-bind:alt=\"cta.text\"/>\n                                            </div>\n                                        </a>\n                                    </div>\n                                    <div>\n                                        <a v-bind:href=\"arrayContent3.image.link\" v-bind:data-description=\"arrayContent3.image.description\" v-bind:data-itemNumber=\"arrayContent3.item\" v-bind:data-cta=\"cta.text\" v-bind:data-sectionDescription=\"section.description\" data-type=\"Image\">\n                                            <div class=\"responsively-lazy preventReflow\">\n                                                <img v-bind:data-srcset=\"responsiveImage(arrayContent3.item, arrayContent3.image.customImage.large, arrayContent3.image.customImage.small)\" v-bind:src=\"arrayContent3.image.customImage.large ? arrayContent3.image.customImage.large : productImgPath(arrayContent3.item,360)\" v-bind:alt=\"cta.text\"/>\n                                            </div>\n                                        </a>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n\n                        <div v-if=\"viewportSize === 'small'\" class=\"small-12 text-center columns white-box-container\">\n                            <label v-if=\"section.text\" class=\"body-small-caps-override\">\n                                <a class=\"a-secondary\" v-html=\"section.text\" v-bind:href=\"section.link\" v-bind:data-description=\"section.description\" v-bind:data-cta=\"cta.text\" v-bind:data-sectionDescription=\"section.description\" data-type=\"Section\"></a>\n                            </label>\n\n                            <a class=\"a-secondary\" v-bind:href=\"headline.link\" v-bind:data-description=\"headline.description\" v-bind:data-cta=\"cta.text\" v-bind:data-sectionDescription=\"section.description\" data-type=\"Headline\"><h3 v-html=\"headline.text\"></h3></a>\n\n                            <p class=\"body-small-override\"><a v-html=\"cta.text\" v-bind:href=\"cta.link\" v-bind:data-description=\"cta.description\" v-bind:data-cta=\"cta.text\" v-bind:data-sectionDescription=\"section.description\" data-type=\"CTA\"></a></p>\n                        </div>\n\n                        <div class=\"small-12 medium-6 columns\">\n                            <div class=\"flex\">\n                                <div class=\"small-8-width\">\n                                    <a v-bind:href=\"arrayContent4.image.link\" v-bind:data-description=\"arrayContent4.image.description\" v-bind:data-itemNumber=\"arrayContent4.item\" v-bind:data-cta=\"cta.text\" v-bind:data-sectionDescription=\"section.description\" data-type=\"Image\">\n                                        <div class=\"responsively-lazy preventReflow\">\n                                            <img v-bind:data-srcset=\"responsiveImage(arrayContent4.item, arrayContent4.image.customImage.large, arrayContent4.image.customImage.small)\" v-bind:src=\"arrayContent4.image.customImage.large ? arrayContent4.image.customImage.large : productImgPath(arrayContent4.item,360)\" v-bind:alt=\"cta.text\"/>\n                                        </div>\n                                    </a>\n                                </div>\n                                <div class=\"small-4-width\">\n                                    <div>\n                                        <a v-bind:href=\"arrayContent5.image.link\" v-bind:data-description=\"arrayContent5.image.description\" v-bind:data-itemNumber=\"arrayContent5.item\" v-bind:data-cta=\"cta.text\" v-bind:data-sectionDescription=\"section.description\" data-type=\"Image\">\n                                            <div class=\"responsively-lazy preventReflow\">\n                                                <img v-bind:data-srcset=\"responsiveImage(arrayContent5.item, arrayContent5.image.customImage.large, arrayContent5.image.customImage.small)\" v-bind:src=\"arrayContent5.image.customImage.large ? arrayContent5.image.customImage.large : productImgPath(arrayContent5.item,360)\" v-bind:alt=\"cta.text\"/>\n                                            </div>\n                                        </a>\n                                    </div>\n                                    <div>\n                                        <a v-bind:href=\"arrayContent6.image.link\" v-bind:data-description=\"arrayContent6.image.description\" v-bind:data-itemNumber=\"arrayContent6.item\" v-bind:data-cta=\"cta.text\" v-bind:data-sectionDescription=\"section.description\" data-type=\"Image\">\n                                            <div class=\"responsively-lazy preventReflow\">\n                                                <img v-bind:data-srcset=\"responsiveImage(arrayContent6.item, arrayContent6.image.customImage.large, arrayContent6.image.customImage.small)\" v-bind:src=\"arrayContent6.image.customImage.large ? arrayContent6.image.customImage.large : productImgPath(arrayContent6.item,360)\" v-bind:alt=\"cta.text\"/>\n                                            </div>\n                                        </a>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n\n                        <div v-if=\"viewportSize != 'small'\" class=\"small-12 columns\">\n                            <div class=\"row\">\n                                <div class=\"medium-8 large-6 medium-centered columns\">\n                                    <div class=\"white-box-container text-center\">\n                                        <label v-if=\"section.text\" class=\"body-small-caps-override\"><a class=\"a-secondary\" v-html=\"section.text\" v-bind:href=\"section.link\" v-bind:data-description=\"section.description\" v-bind:data-cta=\"cta.text\" v-bind:data-sectionDescription=\"section.description\" data-type=\"Section\"></a></label>\n                                        <a v-bind:href=\"headline.link\" v-bind:data-description=\"headline.description\" v-bind:data-cta=\"cta.text\" v-bind:data-sectionDescription=\"section.description\" data-type=\"Headline\"><h1 v-html=\"headline.text\"></h1></a>\n                                        <p class=\"body-small-override\"><a v-html=\"cta.text\" v-bind:href=\"cta.link\" v-bind:data-description=\"cta.description\" v-bind:data-cta=\"cta.text\" v-bind:data-sectionDescription=\"section.description\" data-type=\"CTA\"></a></p>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </section>"
});
Vue.component('carousel-module', {
    template: "\n        <section class=\"carousel-module background-color-off-white\">\n            carousel-module\n        </section>\n    "
});
Vue.component('text-link-module', {
    mixins: [displayGroupMixin, displayOnMixin, productImgPathMixin, responsiveImageMixin, classNameBlockGridMixin],
    props: ['moduleData', 'viewportSize'],
    data: function () {
        return {
            section: this.moduleData.section,
            textLinkModuleSections: this.moduleData.sections,
            nonHiddenModuleSections: [],
            displayGroupViewPortSize: null
        };
    },
    created: function () {
        this.displayGroupViewPortSize = this.displayGroup(this.textLinkModuleSections);
    },
    template: "\n        <section v-if=\"displayOn(displayGroupViewPortSize, viewportSize)\" class=\"text-link-module background-color-off-white\">\n            <div class=\"row fullwidth waterColor\">\n                <div class=\"small-12 large-11 xlarge-10 xxlarge-8 small-centered columns container\">\n                    <div v-if=\"section.text\" class=\"row\">\n                        <div class=\"small-12 text-center columns\">\n                            <h2>\n                                <a class=\"a-secondary\" v-html=\"section.text\" v-bind:href=\"section.link\" v-bind:data-description=\"section.description\" v-bind:data-sectionDescription=\"section.description\" data-type=\"Section\"></a>\n                            </h2>\n                        </div>\n                    </div>\n\n                    <div v-if=\"viewportSize === 'small'\" class=\"row\">\n                        <template v-for=\"(item, index) in textLinkModuleSections\">\n                            <div v-if=\"displayOn(item.displayModuleOn,viewportSize)\" class=\"small-6 columns\">\n                                <div class=\"text-link-container\">\n                                    <div class=\"content\">\n                                        <h4>\n                                            <a class=\"a-secondary\" v-html=\"item.cta.text\" v-bind:href=\"item.cta.link\" v-bind:data-description=\"item.cta.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"section.description\" data-type=\"CTA\"></a>\n                                        </h4>\n                                    </div>\n                                </div>\n                            </div>\n                        </template>\n                    </div>\n\n                    <div v-if=\"viewportSize != 'small'\" class=\"row\">\n                        <div class=\"medium-12 columns\">\n                            <template v-for=\"(item, i) in textLinkModuleSections\">\n                                <div v-if=\"displayOn(item.displayModuleOn,viewportSize)\" v-bind:class=\"classNameBlockGrid(textLinkModuleSections,viewportSize) + ' productContainer text-center content'\">\n                                    <div class=\"responsively-lazy preventReflow\">\n                                        <a v-bind:href=\"item.image.link\" v-bind:data-description=\"item.image.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"section.description\" data-type=\"Image\">\n                                            <img v-bind:data-srcset=\"responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)\" v-bind:src=\"item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,640)\" v-bind:alt=\"item.cta.text\"/>\n                                        </a>\n                                    </div>\n                                    <a class=\"a-secondary\" v-bind:href=\"item.cta.link\" v-bind:data-description=\"item.cta.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"section.description\" data-type=\"CTA\">\n                                        <h4 v-html=\"item.cta.text\"></h4>\n                                    </a>\n                                </div>\n                            </template>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </section>"
});
Vue.component('image-link-double-module', {
    template: "\n        <section class=\"image-link-double-module background-color-off-white\">\n            image-link-double-module\n        </section>\n    "
});
Vue.component('button-link-double-module', {
    template: "\n        <section class=\"button-link-double-module background-color-off-white\">\n            button-link-double-module\n        </section>\n    "
});
Vue.component('seo-link-module', {
    mixins: [displayGroupMixin, displayOnMixin, productImgPathMixin, responsiveImageMixin, classNameBlockGridMixin],
    props: ['moduleData', 'viewportSize'],
    data: function () {
        return {
            seo1: this.moduleData.seo1,
            seo1Sections: this.moduleData.seo1.sections,
            seo2: this.moduleData.seo2,
            seo2Sections: this.moduleData.seo2.sections,
            displayGroupViewPortSize: 'small'
        };
    },
    template: "\n        <section v-if=\"displayOn(displayGroupViewPortSize, viewportSize)\" class=\"seoLinks text-link-module background-color-off-white\">\n            <template v-if=\"viewportSize === 'small'\">\n                <div class=\"row\">\n                    <div class=\"small-12 small-centered columns container\">\n                        <div v-if=\"seo1.section.text\" class=\"row\">\n                            <div class=\"small-12 text-center columns\">\n                                <h2>\n                                    <a class=\"a-secondary\" v-html=\"seo1.section.text\" v-bind:href=\"seo1.section.link\" v-bind:data-description=\"seo1.section.description\" v-bind:data-sectionDescription=\"seo1.section.description\" data-type=\"Section\"></a>\n                                </h2>\n                            </div>\n                        </div>\n                        <div class=\"row\">\n                            <template v-for=\"(item, index) in seo1Sections\">\n                                <div class=\"small-6 columns\">\n                                    <div class=\"text-link-container\">\n                                        <div class=\"content\">\n                                            <h4><a class=\"a-secondary\" v-html=\"item.cta.text\" v-bind:href=\"item.cta.link\" v-bind:data-description=\"item. cta.description\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"seo1.section.description\" data-type=\"CTA\"></a></h4>\n                                        </div>\n                                    </div>\n                                </div>\n                            </template>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"seoLinks2 image-link-double-module background-color-off-white\">\n                    <div class=\"row container\">\n                        <div class=\"small-12 small-centered columns\">\n                            <div v-if=\"seo2.section.text\" class=\"row\">\n                                <div class=\"small-12 xlarge-10 text-center xlarge-centered columns\">\n                                    <h2>\n                                        <a class=\"a-secondary\" v-html=\"seo2.section.text\" v-bind:href=\"seo2.section.link\" v-bind:data-description=\"seo2.section.description\" v-bind:data-sectionDescription=\"seo2.section.description\" data-type=\"Section\"></a>\n                                    </h2>\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"small-11 small-centered columns\">\n                            <div class=\"row\">\n                                <template v-for=\"(item, index) in seo2Sections\">\n                                    <div v-bind:class=\"classNameBlockGrid(seo2Sections,viewportSize) + ' productContainer text-center content'\">\n                                        <div class=\"responsively-lazy preventReflow\">\n                                            <a v-bind:href=\"item.image.link\" v-bind:data-description=\"item.image.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"seo2.section.description\" data-type=\"Image\">\n                                                <img v-bind:data-srcset=\"responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)\" v-bind:src=\"item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,640)\" v-bind:alt=\"item.cta.text\"/>\n                                            </a>\n                                        </div>\n                                        <h4><a class=\"a-secondary\" v-html=\"item.cta.text\" v-bind:href=\"item.cta.link\" v-bind:data-description=\"item.cta.description\" v-bind:data-itemNumber=\"item.item\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"seo2.section.description\" data-type=\"CTA\"></a></h4>\n                                    </div>\n                                </template>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </template>\n\n            <template v-if=\"viewportSize != 'small'\">\n                <div class=\"row fullwidth seo1LinksContainer\">\n                    <div class=\"small-12 columns\">\n                        <div class=\"row topSpacer\">\n                            <div class=\"small-12 columns\">\n                                <div class=\"row collapse\">\n                                    <div class=\"small-6 medium-10 large-8 small-centered columns\" style=\"width: 372px;\">\n                                        <hr class=\"dottedSpacer\">\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"row\">\n                            <div class=\"small-12 text-center columns\">\n                                <div>\n                                    <div class=\"topCatContent\">\n                                        <span v-html=\"seo1.section.text\"></span>\n                                        <div class=\"displayInline\">\n                                            <template v-for=\"(item, index) in seo1Sections\">\n                                                <a v-html=\"item.cta.text\" v-bind:href=\"item.cta.link\" v-bind:data-description=\"item.cta.description\" v-bind:data-sectionDescription=\"seo1.section.description\" v-bind:data-cta=\"item.cta.text\" data-type=\"CTA\" class=\"body-small-crumbs\"></a>\n                                            </template>\n                                        </div>\n                                    </div>\n\n                                    <div>\n                                        <span v-html=\"seo2.section.text\"></span>\n                                        <div class=\"displayInline\">\n                                            <template v-for=\"(item, index) in seo2Sections\">\n                                                <a v-html=\"item.cta.text\" v-bind:href=\"item.cta.link\" v-bind:data-description=\"item.cta.description\" v-bind:data-cta=\"item.cta.text\" v-bind:data-sectionDescription=\"seo2.section.description\"  data-type=\"CTA\" class=\"body-small-crumbs\"></a>\n                                            </template>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"row bottomSpacer\">\n                            <div class=\"small-12 columns\">\n                                <div class=\"row collapse\">\n                                    <div class=\"small-6 medium-10 large-8 small-centered columns\" style=\"width: 372px;\">\n                                        <hr class=\"dottedSpacer\">\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </template>\n        </section>"
});
Vue.component('hp-container', {
    data: function () {
        return {
            componentList: [],
            viewPort: 'small'
        };
    },
    created: function () {
        var _this = this;
        Object.keys(mappingOrder).forEach(function (letter, i) {
            _this.componentList.push(mappingOrder[letter]);
        });
        window.addEventListener('resize', this.breakpointValue);
        this.breakpointValue();
    },
    methods: {
        breakpointValue: function () {
            var size = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');
            this.viewPort = size;
            //console.log('breakpointValue ',size);
        },
        beforeDestroy: function () {
            window.removeEventListener('resize', this.breakpointValue);
        }
    },
    watch: {
        // whenever question changes, this function will run
        viewPort: function () {
            //console.log('watcher ',this.viewPort)
        }
    },
    template: "\n        <div class=\"small-12 columns\">\n            <template v-for=\"(obj, index) in componentList\" key=\"index\">\n                <component :is=\"Object.keys(obj)[0]\" :module-data=\"obj[Object.keys(obj)[0]]\" :viewport-size=\"viewPort\"></component>\n            </template>\n        </div>"
});
var hp_modules = new Vue({
    el: '#hp_modules',
    data: {
        hpJson: mappingOrder
    }
});