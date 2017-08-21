var displayGroupMixin = {
    methods: {
        displayGroup: function(arry) {
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
    }
}

var displayOnMixin = {
    methods: {
        displayOn: function(displayModuleOn,viewPortSize) {
            return {
                'small': viewPortSize === 'small' || viewPortSize === 'medium' || viewPortSize === 'large' || viewPortSize === 'xlarge' ? true : false,
                'medium': viewPortSize === 'medium' || viewPortSize === 'large' || viewPortSize === 'xlarge' ? true : false,
                'large': viewPortSize === 'large' || viewPortSize === 'xlarge' ? true : false,
                'xlarge': viewPortSize === 'xlarge' ? true : false
            }[displayModuleOn]
        }
    }
}

var productImgPathMixin = {
    methods: {
        productImgPath: function(itemId,size) {
            var itemDir = 'https://www.uncommongoods.com/images/items/';
            var itemIdTrim = itemId.toString().slice(0, -2);

            if (size === 640) {
                return itemDir+itemIdTrim+'00/'+itemId+'_1_640px.jpg';
            }
            if (size === 360) {
                return itemDir+itemIdTrim+'00/'+itemId+'_1_360px.jpg';
            }
        }
    }
}

var responsiveImageMixin = {
    // mixins: [productImgPathMixin],
    methods: {
        responsiveImage: function(itemId, largeImage, smallImage) {
            var responsiveValue;
            var largeImageSize = largeImage.split('_').pop().split('.')[0].slice(0, -2);
            var smallImageSize = smallImage.split('_').pop().split('.')[0].slice(0, -2);
            responsiveValue = smallImageSize ? smallImage + ' ' + smallImageSize + 'w, ' : this.productImgPath(itemId,360) + ' 360w, ';
            responsiveValue += largeImageSize ? largeImage + ' ' + largeImageSize + 'w' : this.productImgPath(itemId,640) + ' 640w';
            return responsiveValue;
        }
    }
}

var classNameBlockGridMixin = {
    methods: {
        classNameBlockGrid: function(sectionData,viewPortSize) {
            var nonHiddenModuleSections = [];
            if (viewPortSize === 'small') {
                return 'small-6 columns';
            } else if(viewPortSize === 'medium') {
                sectionData.forEach((module,index) => {
                    if (module.displayModuleOn === 'small' || module.displayModuleOn === 'medium') {
                        nonHiddenModuleSections.push(module.displayModuleOn)
                    }
                })
                return {
                    '4': 'medium-3 columns',
                    '6': 'medium-2 columns'
                }[nonHiddenModuleSections.length];

            } else if(viewPortSize === 'large') {
                sectionData.forEach((module,index) => {
                    if (module.displayModuleOn === 'small' || module.displayModuleOn === 'medium' || module.displayModuleOn === 'large') {
                        nonHiddenModuleSections.push(module.displayModuleOn)
                    }
                })
                return {
                    '4': 'large-3 columns',
                    '6': 'large-2 columns'
                }[nonHiddenModuleSections.length];
            } else {
                sectionData.forEach((module,index) => {
                    if (module.displayModuleOn === 'small' || module.displayModuleOn === 'medium' || module.displayModuleOn === 'large' || module.displayModuleOn === 'xlarge') {
                        nonHiddenModuleSections.push(module.displayModuleOn)
                    }
                })
                return {
                    '4': 'medium-3 columns',
                    '6': 'medium-2 columns'
                }[nonHiddenModuleSections.length];
            }
        }
    }
}

Vue.component('large-feature-module', {
    mixins: [displayGroupMixin, displayOnMixin, productImgPathMixin],
    props: ['moduleData', 'viewportSize'],
    data: function() {
        return {
            largeFeatureModulesSections: this.moduleData.sections,
            displayGroupViewPortSize: null
        }
    },
    created: function() {
        this.displayGroupViewPortSize = this.displayGroup(this.largeFeatureModulesSections);
    },
    methods: {
        isVideo: function(video) {
            return video.split('.').pop() === 'mp4' ? true : false;
        },
        posterImage: function(videoFile) {
            return videoFile.split('.').shift() + '.jpg';
        }
    },
    template: `
        <section v-if="displayOn(displayGroupViewPortSize, viewportSize)" class="large-feature-module background-color-off-white" data-module-type="LF">
            <template v-for="item in largeFeatureModulesSections">
                <template v-if="displayOn(item.displayModuleOn, viewportSize)">
                    <div class="row fullwidth">
                        <div class="small-12 large-11 xlarge-10 xxlarge-8 large-centered columns">
                            <a v-bind:href="item.image.link" v-bind:data-description="item.image.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" data-type="Image">
                                <picture>
                                    <!--[if IE 9]><video style="display: none;"><![endif]-->
                                        <source v-bind:srcset="item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,640)"/>
                                        <source v-bind:srcset="item.image.customImage.small ? item.image.customImage.small : productImgPath(item.item,360)"/>
                                    <!--[if IE 9]></video><![endif]-->

                                    <template v-if="viewportSize === 'small'">
                                        <div class="responsively-lazy preventReflow">
                                            <p v-html="item.image.customImage.small"></p>
                                            <img v-bind:src="item.image.customImage.small ? item.image.customImage.small : productImgPath(item,360)" v-bind:alt="item.cta.text">
                                        </div>
                                    </template>

                                    <template v-if="viewportSize != 'small'">
                                        <template v-if="isVideo(item.image.customImage.large)">
                                            <video loop muted autoplay v-bind:poster="posterImage(item.image.customImage.large)">
                                                <source v-bind:src="item.image.customImage.large" type="video/mp4">
                                                <source v-bind:src="item.image.customImage.large" type="video/webm">
                                            </video>
                                        </template>

                                        <template v-if="!isVideo(item.image.customImage.large)">
                                            <div class="responsively-lazy preventReflow">
                                                <div v-bind:style="{ backgroundImage: 'url( '+ item.image.customImage.large  +' )' }" class="LF_backgroundImage"></div>
                                            </div>
                                        </template>
                                    </template>
                                </picture>

                                <div class="row fullwidth">
                                    <div class="small-12 medium-8 large-6 small-centered columns">
                                        <div class="white-box-container text-center">
                                            <a class="a-secondary" v-bind:href="item.headline.link" v-bind:data-description="item.headline.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" data-type="Headline">
                                                <h1 v-html="item.headline.text"></h1>
                                            </a>

                                            <p class="body-small-override">
                                                <a v-html="item.cta.text" v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" data-type="CTA"></a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </template>
            </template>
        </section>`
})

Vue.component('small-feature-module', {
    mixins: [displayGroupMixin, displayOnMixin, productImgPathMixin, responsiveImageMixin],
    props: ['moduleData', 'viewportSize'],
    data: function() {
        return {
            smModulesSections: this.moduleData.sections,
            displayGroupViewPortSize: null
        }
    },
    created: function() {
        this.displayGroupViewPortSize = this.displayGroup(this.smModulesSections);
    },
    methods: {
        isEven: function(index) {
            return index % 2 === 0 ? true : false
        },
        className: function(sectionData) {
            var nonHiddenModuleSections = [];
            if(this.viewportSize === 'large') {
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
    },
    template: `
        <section v-if="displayOn(displayGroupViewPortSize, viewportSize)" class="small-feature-module background-color-white" data-module-type="SF">
            <template v-if="viewportSize === 'small' || viewportSize === 'medium'">
                <template v-for="(item, index) in smModulesSections">
                    <template v-if="displayOn(item.displayModuleOn, viewportSize)">
                        <template v-if="isEven(index)">
                            <div class="row fullwidth">
                                <div class="container">
                                    <div class="small-6 medium-7 columns">
                                        <div v-bind:style="{ margin: viewportSize === 'medium' ? '-1.5rem 0 0 -1.5rem' : '0' }">
                                            <a v-bind:href="item.image.link" v-bind:data-description="item.image.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Image">
                                                <div class="responsively-lazy preventReflow">
                                                    <img class="right" v-bind:data-srcset="responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)" v-bind:src="item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,360)" v-bind:alt="item.cta.text"/>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="small-6 medium-5 columns text-center">
                                        <div class="copyContainer">
                                            <label v-if="item.section.text" class="body-small-caps-override">
                                                <a class="a-secondary" v-html="item.section.text" v-bind:href="item.section.link" v-bind:data-description="item.section.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Section"></a>
                                            </label>

                                            <a v-bind:href="item.headline.link" v-bind:data-description="item.headline.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.descriptio" data-type="Headline">
                                                <h3 v-html="item.headline.text"></h3>
                                            </a>

                                            <p class="body-small-override">
                                                <a v-html="item.cta.text" v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" data-type="CTA"></a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <template v-if="!isEven(index)">
                            <div class="row fullwidth">
                                <div class="container">
                                    <div class="small-6 medium-5 columns text-center">
                                        <div class="copyContainer">
                                            <label v-if="item.section.text" class="body-small-caps-override">
                                                <a class="a-secondary" v-html="item.section.text" v-bind:href="item.section.link" v-bind:data-description="item.section.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Section"></a>
                                            </label>

                                            <a v-bind:href="item.headline.link" v-bind:data-description="item.headline.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.descriptio" data-type="Headline">
                                                <h3 v-html="item.headline.text"></h3>
                                            </a>

                                            <p class="body-small-override">
                                                <a v-html="item.cta.text" v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" data-type="CTA"></a>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="small-6 medium-7 columns">
                                        <div v-bind:style="{ margin: viewportSize === 'medium' ? '-1.5rem 0 0 -1.5rem' : '0' }">
                                            <a v-bind:href="item.image.link" v-bind:data-description="item.image.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Image">
                                                <div class="responsively-lazy preventReflow">
                                                    <img class="right" v-bind:data-srcset="responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)" v-bind:src="item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,360)" v-bind:alt="item.cta.text"/>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>
                </template>
            </template>

            <template v-if="viewportSize === 'large' || viewportSize === 'xlarge'">
                <div class="row fullwidth">
                    <div class="large-11 xlarge-10 xxlarge-8 large-centered columns">
                        <div class="row fullwidth">
                            <template v-for="(item, index) in smModulesSections">
                                <template v-if="displayOn(item.displayModuleOn, viewportSize)">
                                    <div v-bind:class="className(smModulesSections)">
                                        <a v-bind:href="item.image.link" v-bind:data-description="item.image.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Image">
                                            <div class="responsively-lazy preventReflow">
                                                <img class="right" v-bind:data-srcset="responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)" v-bind:src="item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,360)" v-bind:alt="item.cta.text"/>
                                            </div>
                                        </a>
                                        <div class="row">
                                            <div class="large-12 large-centered columns">
                                                <div class="white-box-container text-center">
                                                    <label v-if="item.section.text" class="body-small-caps-override">
                                                        <a class="a-secondary" v-html="item.section.text" v-bind:href="item.section.link" v-bind:data-description="item.section.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Section"></a>
                                                    </label>
                                                    <a v-bind:href="item.headline.link" v-bind:data-description="item.headline.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Headline">
                                                        <h2 v-html="item.headline.text"></h2>
                                                    </a>
                                                    <p class="body-small-override">
                                                        <a v-html="item.cta.text" v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="CTA"></a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </section>`
})

Vue.component('basic-story-module', {
    mixins: [displayGroupMixin, displayOnMixin, productImgPathMixin, responsiveImageMixin],
    props: ['moduleData', 'viewportSize'],
    data: function() {
        return {
            basicStoryModulesSections: this.moduleData.sections,
            displayGroupViewPortSize: null
        }
    },
    created: function() {
        this.displayGroupViewPortSize = this.displayGroup(this.basicStoryModulesSections);
    },
    methods: {
        isEven: function(index) {
            return index % 2 === 0 ? true : false
        },
        className: function(sectionData,viewportSize) {
            var nonHiddenModuleSections = [];
            if(viewportSize === 'large') {
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
    },
    template: `
        <section v-if="displayOn(displayGroupViewPortSize, viewportSize)" class="basic-story-module background-color-off-white" data-module-type="BS">
            <template v-if="viewportSize === 'small'">
                <template v-for="(item, index) in basicStoryModulesSections">
                    <div v-if="displayOn(item.displayModuleOn, viewportSize)" class="row container">
                        <div v-if="item.section.text" class="small-12 text-center columns">
                            <label class="body-small-caps-override">
                                <a class="a-secondary" v-html="item.section.text" v-bind:href="item.section.link" v-bind:data-description="item.section.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Section"></a>
                            </label>
                        </div>

                        <div class="small-12 columns">
                            <div class="row">
                                <div class="small-10 small-centered text-center columns">
                                    <a v-bind:attr="item.headline.link" v-bind:data-description="item.headline.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Headline">
                                        <h2 v-html="item.headline.text"></h2>
                                    </a>
                                    <a v-bind:href="item.image.link" v-bind:data-description="item.image.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Image">
                                        <div class="responsively-lazy preventReflow">
                                            <img v-bind:data-srcset="responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)" v-bind:src="item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,640)" v-bind:alt="item.cta.text"/>
                                        </div>
                                    </a>
                                    <a v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="CTA">
                                        <button class="btn-secondary expand" v-html="item.cta.text"></button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </template>

            <template v-if="viewportSize === 'medium'">
                <template v-for="(item, index) in basicStoryModulesSections">
                    <div v-if="displayOn(item.displayModuleOn, viewportSize) && isEven(index)" class="row fullwidth">
                        <div class="container">
                            <div class="medium-7 columns">
                                <div style="margin-top: -1.5rem; margin-left: -1.5rem;">
                                    <a v-bind:href="item.image.link" v-bind:data-description="item.image.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Image">
                                        <div class="responsively-lazy preventReflow">
                                            <img class="right" v-bind:data-srcset="responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)" v-bind:src="item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,360)" v-bind:alt="item.cta.text"/>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div class="medium-5 columns text-center">
                                <div class="copyContainer">
                                    <label v-if="item.section.text" class="body-small-caps-override">
                                        <a class="a-secondary" v-html="item.section.text" v-bind:href="item.section.link" v-bind:data-description="item.section.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Section"></a>
                                    </label>
                                    <a v-bind:href="item.headline.link" v-bind:data-description="item.headline.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Headline">
                                        <h2 v-html="item.headline.text"></h2>
                                    </a>
                                    <p class="body-small-override">
                                        <a v-html="item.cta.text" v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="CTA"></a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="displayOn(item.displayModuleOn, viewportSize) && !isEven(index)" class="row fullwidth">
                        <div class="container">
                            <div class="medium-5 columns text-center">
                                <div class="copyContainer">
                                    <label v-if="item.section.text" class="body-small-caps-override">
                                        <a class="a-secondary" v-html="item.section.text" v-bind:href="item.section.link" v-bind:data-description="item.section.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Section"></a>
                                    </label>
                                    <a v-bind:href="item.headline.link" v-bind:data-description="item.headline.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Headline">
                                        <h2 v-html="item.headline.text"></h2>
                                    </a>
                                    <p class="body-small-override">
                                        <a v-html="item.cta.text" v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="CTA"></a>
                                    </p>
                                </div>
                            </div>
                            <div class="medium-7 columns">
                                <div style="margin-top: -1.5rem; margin-left: -1.5rem;">
                                    <a v-bind:href="item.image.link" v-bind:data-description="item.image.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Image">
                                        <div class="responsively-lazy preventReflow">
                                            <img class="right" v-bind:data-srcset="responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)" v-bind:src="item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,360)" v-bind:alt="item.cta.text"/>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </template>

            <template v-if="viewportSize === 'large' || viewportSize === 'xlarge'">
                <div class="row fullwidth">
                    <div class="large-11 xlarge-10 xxlarge-8 large-centered columns">
                        <div class="row">
                            <template v-for="(item, index) in basicStoryModulesSections">
                                <div v-if="displayOn(item.displayModuleOn, viewportSize)" v-bind:class="className(basicStoryModulesSections,viewportSize)">
                                    <a v-bind:href="item.image.link" v-bind:data-description="item.image.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Image">
                                        <div class="responsively-lazy preventReflow">
                                            <img class="right" v-bind:data-srcset="responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)" v-bind:src="item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,360)" v-bind:alt="item.cta.text"/>
                                        </div>
                                    </a>
                                    <div class="row">
                                        <div class="large-12 large-centered columns">
                                            <div class="white-box-container text-center">
                                                <label v-if="item.section.text" class="body-small-caps-override">
                                                    <a class="a-secondary" v-html="item.section.text" v-bind:href="item.section.link" v-bind:data-description="item. section.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Section"></a>
                                                </label>

                                                <a v-bind:href="item.headline.link" v-bind:data-description="item.headline.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Headline">
                                                    <h2 v-html="item.headline.text"></h2>
                                                </a>
                                                <p class="body-small-override">
                                                    <a v-html="item.cta.text" v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="CTA"></a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </section>`
})

Vue.component('extended-story-module', {
    mixins: [displayGroupMixin, displayOnMixin, productImgPathMixin, responsiveImageMixin],
    props: ['moduleData', 'viewportSize'],
    data: function() {
        return {
            extendedStoryModulesSections: this.moduleData.sections,
            displayGroupViewPortSize: null
        }
    },
    created: function() {
        this.displayGroupViewPortSize = this.displayGroup(this.extendedStoryModulesSections);
    },
    methods: {
        isEven: function(index) {
            return index % 2 === 0 ? true : false;
        }
    },
    template: `
        <section v-if="displayOn(displayGroupViewPortSize, viewportSize)" class="extended-story-module background-color-off-white" data-module-type="ES">
            <template v-if="viewportSize === 'small'">
                <template v-for="(item, index) in extendedStoryModulesSections">
                    <div v-if="displayOn(item.displayModuleOn, viewportSize)" class="row container">
                        <div class="small-12 text-center columns">
                            <div v-if="item.section.text" class="small-12 text-center columns">
                                <label class="body-small-caps-override"><a class="a-secondary" v-html="item.section.text" v-bind:href="item.section.link" v-bind:data-description="item.section.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Section"></a></label>
                            </div>
                            <div class="small-12 text-center columns">
                                <a v-bind:href="item.headline.link" v-bind:data-description="item.headline.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Headline">
                                    <h2 v-html="item.headline.text"></h2>
                                </a>
                            </div>
                            <div class="small-12 text-center columns">
                                <div class="row">
                                    <div class="small-11 small-centered columns">
                                        <a v-bind:href="item.image.link" v-bind:data-description="item.image.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description data-type="Image">
                                            <div class="responsively-lazy preventReflow itemPhoto">
                                                <img v-bind:data-srcset="responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)" v-bind:src="item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,640)" v-bind:alt="item.cta.text"/>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="small-11 text-center columns">
                                <p class="text-left">
                                    <a class="a-secondary" v-html="item.copy.text" v-bind:href="item.copy.link" v-bind:data-description="item.copy.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Copy"></a>
                                </p>
                                <p class="body-small-override">
                                    <a v-html="item.cta.text" v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="CTA"></a>
                                </p>
                            </div>
                        </div>
                    </div>
                </template>
            </template>

            <template v-if="viewportSize === 'medium' || viewportSize === 'large' || viewportSize === 'xlarge'">
                <template v-for="(item, index) in extendedStoryModulesSections">
                    <div v-if="displayOn(item.displayModuleOn, viewportSize) && !isEven(index)" class="row fullwidth">
                        <div class="medium-12 large-11 xlarge-10 xxlarge-8  large-centered columns">
                            <div class="row">
                                <div class="container">
                                    <div class="medium-5 large-4 columns text-center">
                                        <div class="copyContainer">
                                            <label v-if="item.section.text" class="body-small-caps-override">
                                                <a class="a-secondary" v-html="item.section.text" v-bind:href="item.section.link" v-bind:data-description="item.section.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Section"></a>
                                            </label>

                                            <a v-bind:href="item.headline.link" v-bind:data-description="item.headline.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Headline">
                                                <h2 v-html="item.headline.text"></h2>
                                            </a>

                                            <p class="text-left">
                                                <a class="a-secondary" v-html="item.copy.text" v-bind:href="item.copy.link" v-bind:data-description="item.copy.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Copy"></a>
                                            </p>
                                            <p class="body-small-override">
                                                <a v-html="item. cta.text" v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="CTA"></a>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="medium-7 large-8 columns">
                                        <div style="margin: -1.5rem -1.5rem 0 0;">
                                            <a v-bind:href="item.image.link" v-bind:data-description="item.image.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Image">
                                                <div class="responsively-lazy preventReflow">
                                                    <img class="right" v-bind:data-srcset="responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)" v-bind:src="item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,360)" v-bind:alt="item.cta.text"/>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="displayOn(item.displayModuleOn, viewportSize) && isEven(index)" class="row fullwidth">
                        <div class="medium-12 large-11 xlarge-10 xxlarge-8 large-centered columns">
                            <div class="row">
                                <div class="container">
                                    <div class="medium-7 large-8 columns">
                                        <div style="margin: -1.5rem 0 0 -1.5rem;">
                                            <a v-bind:href="item.image.link" v-bind:data-description="item.image.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Image">
                                                <div class="responsively-lazy preventReflow">
                                                    <img class="right" v-bind:data-srcset="responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)" v-bind:src="item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,360)" v-bind:alt="item.cta.text"/>
                                                </div>
                                            </a>
                                        </div>
                                    </div>

                                    <div class="medium-5 large-4 columns text-center">
                                        <div class="copyContainer">
                                            <label v-if="item.section.text" class="body-small-caps-override">
                                                <a class="a-secondary" v-html:="item.section.text" v-bind:href="item.section.link" v-bind:data-description="item.section.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Section"></a>
                                            </label>

                                            <a v-bind:href="item.headline.link" v-bind:data-description="item.headline.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Headline">
                                                <h2 v-html="item.headline.text"></h2>
                                            </a>

                                            <p class="text-left">
                                                <a class="a-secondary" v-html="item.copy.text" v-bind:href="item.copy.link" v-bind:data-description="item.copy.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="Copy"></a>
                                            </p>
                                            <p class="body-small-override">
                                                <a v-html="item.cta.text" v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="item.section.description" data-type="CTA"></a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </template>
        </section>`
})

Vue.component('collection-grid-module', {
    mixins: [displayGroupMixin, displayOnMixin, productImgPathMixin, responsiveImageMixin],
    props: ['moduleData', 'viewportSize'],
    data: function() {
        return {
            section: this.moduleData.section
            headline: this.moduleData.headline;
            cta: this.moduleData.cta;
            collectionGridModulesSections: this.moduleData.sections,
            arrayContent1: null,
            arrayContent2: null,
            arrayContent3: null,
            arrayContent4: null,
            arrayContent5: null,
            arrayContent6: null,
            displayGroupViewPortSize: null
        }
    },
    created: function() {
        this.displayGroupViewPortSize = this.moduleData.displayModuleOn;
        this.arrayContent1 = this.collectionGridModulesSections[0];
        this.arrayContent2 = this.collectionGridModulesSections[1];
        this.arrayContent3 = this.collectionGridModulesSections[2];
        this.arrayContent4 = this.collectionGridModulesSections[3];
        this.arrayContent5 = this.collectionGridModulesSections[4];
        this.arrayContent6 = this.collectionGridModulesSections[5];
    },
    template: `
        <section v-if="displayOn(displayGroupViewPortSize, viewportSize)" class="collection-grid-module background-color-off-white" data-module-type="CG">
            <div class="row fullwidth">
                <div class="small-12 large-11 xlarge-10 xxlarge-8 large-centered columns">
                    <div class="row container">
                        <div class="small-12 medium-6 columns">
                            <div class="flex">
                                <div class="small-8-width">
                                    <a v-bind:href="arrayContent1.image.link" v-bind:data-description="arrayContent1.image.description" v-bind:data-itemNumber="arrayContent1.item" v-bind:data-cta="cta.text" v-bind:data-sectionDescription="section.description" data-type="Image">
                                        <div class="responsively-lazy preventReflow">
                                            <img v-bind:data-srcset="responsiveImage(arrayContent1.item, arrayContent1.image.customImage.large, arrayContent1.image.customImage.small)" v-bind:src="arrayContent1.image.customImage.large ? arrayContent1.image.customImage.large : productImgPath(arrayContent1.item,360)" v-bind:alt="cta.text"/>
                                        </div>
                                    </a>
                                </div>
                                <div class="small-4-width">
                                    <div>
                                        <a v-bind:href="arrayContent2.image.link" v-bind:data-description="arrayContent2.image.description" v-bind:data-itemNumber="arrayContent2.item" v-bind:data-cta="cta.text" v-bind:data-sectionDescription="section.description" data-type="Image">
                                            <div class="responsively-lazy preventReflow">
                                                <img v-bind:data-srcset="responsiveImage(arrayContent2.item, arrayContent2.image.customImage.large, arrayContent2.image.customImage.small)" v-bind:src="arrayContent2.image.customImage.large ? arrayContent2.image.customImage.large : productImgPath(arrayContent2.item,360)" v-bind:alt="cta.text"/>
                                            </div>
                                        </a>
                                    </div>
                                    <div>
                                        <a v-bind:href="arrayContent3.image.link" v-bind:data-description="arrayContent3.image.description" v-bind:data-itemNumber="arrayContent3.item" v-bind:data-cta="cta.text" v-bind:data-sectionDescription="section.description" data-type="Image">
                                            <div class="responsively-lazy preventReflow">
                                                <img v-bind:data-srcset="responsiveImage(arrayContent3.item, arrayContent3.image.customImage.large, arrayContent3.image.customImage.small)" v-bind:src="arrayContent3.image.customImage.large ? arrayContent3.image.customImage.large : productImgPath(arrayContent3.item,360)" v-bind:alt="cta.text"/>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="viewportSize === 'small'" class="small-12 text-center columns white-box-container">
                            <label v-if="section.text" class="body-small-caps-override">
                                <a class="a-secondary" v-html="section.text" v-bind:href="section.link" v-bind:data-description="section.description" v-bind:data-cta="cta.text" v-bind:data-sectionDescription="section.description" data-type="Section"></a>
                            </label>

                            <a class="a-secondary" v-bind:href="headline.link" v-bind:data-description="headline.description" v-bind:data-cta="cta.text" v-bind:data-sectionDescription="section.description" data-type="Headline"><h3 v-html="headline.text"></h3></a>

                            <p class="body-small-override"><a v-html="cta.text" v-bind:href="cta.link" v-bind:data-description="cta.description" v-bind:data-cta="cta.text" v-bind:data-sectionDescription="section.description" data-type="CTA"></a></p>
                        </div>

                        <div class="small-12 medium-6 columns">
                            <div class="flex">
                                <div class="small-8-width">
                                    <a v-bind:href="arrayContent4.image.link" v-bind:data-description="arrayContent4.image.description" v-bind:data-itemNumber="arrayContent4.item" v-bind:data-cta="cta.text" v-bind:data-sectionDescription="section.description" data-type="Image">
                                        <div class="responsively-lazy preventReflow">
                                            <img v-bind:data-srcset="responsiveImage(arrayContent4.item, arrayContent4.image.customImage.large, arrayContent4.image.customImage.small)" v-bind:src="arrayContent4.image.customImage.large ? arrayContent4.image.customImage.large : productImgPath(arrayContent4.item,360)" v-bind:alt="cta.text"/>
                                        </div>
                                    </a>
                                </div>
                                <div class="small-4-width">
                                    <div>
                                        <a v-bind:href="arrayContent5.image.link" v-bind:data-description="arrayContent5.image.description" v-bind:data-itemNumber="arrayContent5.item" v-bind:data-cta="cta.text" v-bind:data-sectionDescription="section.description" data-type="Image">
                                            <div class="responsively-lazy preventReflow">
                                                <img v-bind:data-srcset="responsiveImage(arrayContent5.item, arrayContent5.image.customImage.large, arrayContent5.image.customImage.small)" v-bind:src="arrayContent5.image.customImage.large ? arrayContent5.image.customImage.large : productImgPath(arrayContent5.item,360)" v-bind:alt="cta.text"/>
                                            </div>
                                        </a>
                                    </div>
                                    <div>
                                        <a v-bind:href="arrayContent6.image.link" v-bind:data-description="arrayContent6.image.description" v-bind:data-itemNumber="arrayContent6.item" v-bind:data-cta="cta.text" v-bind:data-sectionDescription="section.description" data-type="Image">
                                            <div class="responsively-lazy preventReflow">
                                                <img v-bind:data-srcset="responsiveImage(arrayContent6.item, arrayContent6.image.customImage.large, arrayContent6.image.customImage.small)" v-bind:src="arrayContent6.image.customImage.large ? arrayContent6.image.customImage.large : productImgPath(arrayContent6.item,360)" v-bind:alt="cta.text"/>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="viewportSize != 'small'" class="small-12 columns">
                            <div class="row">
                                <div class="medium-8 large-6 medium-centered columns">
                                    <div class="white-box-container text-center">
                                        <label v-if="section.text" class="body-small-caps-override"><a class="a-secondary" v-html="section.text" v-bind:href="section.link" v-bind:data-description="section.description" v-bind:data-cta="cta.text" v-bind:data-sectionDescription="section.description" data-type="Section"></a></label>
                                        <a v-bind:href="headline.link" v-bind:data-description="headline.description" v-bind:data-cta="cta.text" v-bind:data-sectionDescription="section.description" data-type="Headline"><h1 v-html="headline.text"></h1></a>
                                        <p class="body-small-override"><a v-html="cta.text" v-bind:href="cta.link" v-bind:data-description="cta.description" v-bind:data-cta="cta.text" v-bind:data-sectionDescription="section.description" data-type="CTA"></a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>`
})

Vue.component('text-link-module', {
    mixins: [displayGroupMixin, displayOnMixin, productImgPathMixin, responsiveImageMixin, classNameBlockGridMixin],
    props: ['moduleData', 'viewportSize'],
    data: function() {
        return {
            section: this.moduleData.section,
            textLinkModuleSections: this.moduleData.sections,
            displayGroupViewPortSize: null
        }
    },
    created: function() {
        this.displayGroupViewPortSize = this.displayGroup(this.textLinkModuleSections);
    },
    template: `
        <section v-if="displayOn(displayGroupViewPortSize, viewportSize)" class="text-link-module background-color-off-white" data-module-type="TL">
            <div class="row fullwidth waterColor">
                <div class="small-12 large-11 xlarge-10 xxlarge-8 small-centered columns container">
                    <div v-if="section.text" class="row">
                        <div class="small-12 text-center columns">
                            <h2>
                                <a class="a-secondary" v-html="section.text" v-bind:href="section.link" v-bind:data-description="section.description" v-bind:data-sectionDescription="section.description" data-type="Section"></a>
                            </h2>
                        </div>
                    </div>

                    <div v-if="viewportSize === 'small'" class="row">
                        <template v-for="(item, index) in textLinkModuleSections">
                            <div v-if="displayOn(item.displayModuleOn,viewportSize)" class="small-6 columns">
                                <div class="text-link-container">
                                    <div class="content">
                                        <h4>
                                            <a class="a-secondary" v-html="item.cta.text" v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="section.description" data-type="CTA"></a>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <div v-if="viewportSize != 'small'" class="row">
                        <div class="medium-12 columns">
                            <template v-for="(item, i) in textLinkModuleSections">
                                <div v-if="displayOn(item.displayModuleOn,viewportSize)" v-bind:class="classNameBlockGrid(textLinkModuleSections,viewportSize) + ' productContainer text-center content'">
                                    <div class="responsively-lazy preventReflow">
                                        <a v-bind:href="item.image.link" v-bind:data-description="item.image.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="section.description" data-type="Image">
                                            <img v-bind:data-srcset="responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)" v-bind:src="item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,640)" v-bind:alt="item.cta.text"/>
                                        </a>
                                    </div>
                                    <a class="a-secondary" v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="section.description" data-type="CTA">
                                        <h4 v-html="item.cta.text"></h4>
                                    </a>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </section>`
})

Vue.component('image-link-double-module', {
    mixins: [displayGroupMixin, displayOnMixin, productImgPathMixin, responsiveImageMixin, classNameBlockGridMixin],
    props: ['moduleData', 'viewportSize'],
    data: function() {
        return {
            section: this.moduleData.section,
            imageLinkDoubleModuleSections: this.moduleData.sections,
            displayGroupViewPortSize: null
        }
    },
    created: function() {
        this.displayGroupViewPortSize = this.displayGroup(this.imageLinkDoubleModuleSections);
    },
    template: `
        <section v-if="displayOn(displayGroupViewPortSize, viewportSize)" class="image-link-double-module background-color-off-white" data-module-type="LD">
            <div class="row fullwidth waterColor">
                <div class="small-12 large-11 xlarge-10 xxlarge-8 small-centered columns container">
                    <div v-if="section.text" class="row">
                        <div class="small-12 xlarge-10 xxlarge-8 text-center xlarge-centered columns">
                            <h2>
                                <a class="a-secondary" v-html="section.text" v-bind:href="section.link" v-bind:data-description="section.description" v-bind:data-sectionDescription="section.description" data-type="Section"></a>
                            </h2>
                        </div>
                    </div>

                    <div class="row">
                        <div class="small-11 medium-12 small-centered columns">
                            <template v-for="(item, index) in imageLinkDoubleModuleSections">
                                <div v-if="displayOn(displayGroupViewPortSize, viewportSize)" v-bind:class="classNameBlockGrid(imageLinkDoubleModuleSections,viewportSize) + ' productContainer text-center'">
                                    <div class="responsively-lazy preventReflow">
                                        <a v-bind:href="item.image.link" v-bind:data-description="item.image.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="section.description" data-type="Image">
                                            <img v-bind:data-srcset="responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)" v-bind:src="item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,640)" v-bind:alt="item.cta.text"/>
                                        </a>
                                    </div>
                                    <h4>
                                        <a class="a-secondary" v-html="item.cta.text" v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="section.description" data-type="CTA"></a>
                                    </h4>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </section>`
})

Vue.component('button-link-double-module', {
    mixins: [displayGroupMixin, displayOnMixin, productImgPathMixin, responsiveImageMixin, classNameBlockGridMixin],
    props: ['moduleData', 'viewportSize'],
    data: function() {
        return {
            section: this.moduleData.section,
            buttonLinkDoubleModuleSections: this.moduleData.sections,
            arrayContent1: null,
            arrayContent2: null,
            arrayContent3: null,
            arrayContent4: null,
            arrayContent5: null,
            arrayContent6: null,
            displayGroupViewPortSize: null
        }
    },
    created: function() {
        this.displayGroupViewPortSize = this.displayGroup(this.buttonLinkDoubleModuleSections);
        this.arrayContent1 = this.buttonLinkDoubleModuleSections[0];
        this.arrayContent2 = this.buttonLinkDoubleModuleSections[1];
        this.arrayContent3 = this.buttonLinkDoubleModuleSections[2];
        this.arrayContent4 = this.buttonLinkDoubleModuleSections[3];
        this.arrayContent5 = this.buttonLinkDoubleModuleSections[4];
        this.arrayContent6 = this.buttonLinkDoubleModuleSections[5];
    },
    methods: {
        shouldStack: function(index) {
            return this.viewportSize === 'xlarge' && this.buttonLinkDoubleModuleSections.length === 6 ? true : false;
        },
        showBtnContainerInside: function() {
            return this.viewportSize != 'small' && this.buttonLinkDoubleModuleSections.length === 4 || this.viewportSize === 'medium' && this.buttonLinkDoubleModuleSections.length === 6 ? true : false;
        },
        showBtnContainerHanging: function() {
            return this.viewportSize === 'small' || this.viewportSize === 'large' && this.buttonLinkDoubleModuleSections.length === 6 ? true : false;
        }
    },
    template: `
        <section v-if="displayOn(displayGroupViewPortSize, viewportSize)" class="button-link-double-module background-color-white" data-module-type="BD">
            <div class="row">
                <div class="small-12 columns">
                    <div class="row collapse">
                        <div class="small-8 medium-10 large-8 small-centered columns">
                            <hr class="dottedSpacer">
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="section.text" class="row">
                <div class="small-12 small-centered text-center columns">
                    <h2>
                        <a class="a-secondary" v-html="section.text" v-bind:href="section.link" v-bind:data-description="section.description" v-bind:data-sectionDescription="section.description" data-type="Section"></a>
                    </h2>
                </div>
            </div>

            <div v-if="!shouldStack()" class="row fullwidth">
                <div class="small-12 large-11 xlarge-10 xxlarge-8 large-centered columns">
                    <template v-for="(item, index) in buttonLinkDoubleModuleSections">
                        <div v-if="displayOn(item.displayModuleOn,viewportSize)" v-bind:class="classNameBlockGrid(buttonLinkDoubleModuleSections,viewportSize) + ' productContainer'">
                            <div class="responsively-lazy preventReflow">
                                <a v-bind:href="item.image.link" v-bind:data-description="item.image.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="section.description" data-type="Image">
                                    <img v-bind:src="item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,640)" v-bind:data-srcset="responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)" v-bind:alt="item.cta.text"/>
                                </a>

                                <div v-if="showBtnContainerInside()" class="btnContainerInside">
                                    <a v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="section.description" data-type="CTA">
                                        <button class="btn-secondary expand" v-html="item.cta.text"></button>
                                    </a>
                                </div>
                            </div>

                            <div v-if="showBtnContainerHanging()" class="btnContainerHanging">
                                <a v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="section.description" data-type="CTA">
                                    <button class="btn-secondary expand" v-html="item.cta.text"></button>
                                </a>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </section>`
})

Vue.component('seo-link-module', {
    mixins: [displayGroupMixin, displayOnMixin, productImgPathMixin, responsiveImageMixin, classNameBlockGridMixin],
    props: ['moduleData', 'viewportSize'],
    data: function() {
        return {
            seo1: this.moduleData.seo1,
            seo1Sections: this.moduleData.seo1.sections,
            seo2: this.moduleData.seo2,
            seo2Sections: this.moduleData.seo2.sections,
            displayGroupViewPortSize: 'small'
        }
    },
    template: `
        <section v-if="displayOn(displayGroupViewPortSize, viewportSize)" class="seoLinks text-link-module background-color-off-white" data-module-type="TL_SEO">
            <template v-if="viewportSize === 'small'">
                <div class="row">
                    <div class="small-12 small-centered columns container">
                        <div v-if="seo1.section.text" class="row">
                            <div class="small-12 text-center columns">
                                <h2>
                                    <a class="a-secondary" v-html="seo1.section.text" v-bind:href="seo1.section.link" v-bind:data-description="seo1.section.description" v-bind:data-sectionDescription="seo1.section.description" data-type="Section"></a>
                                </h2>
                            </div>
                        </div>
                        <div class="row">
                            <template v-for="(item, index) in seo1Sections">
                                <div class="small-6 columns">
                                    <div class="text-link-container">
                                        <div class="content">
                                            <h4><a class="a-secondary" v-html="item.cta.text" v-bind:href="item.cta.link" v-bind:data-description="item. cta.description" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="seo1.section.description" data-type="CTA"></a></h4>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <div class="seoLinks2 image-link-double-module background-color-off-white">
                    <div class="row container">
                        <div class="small-12 small-centered columns">
                            <div v-if="seo2.section.text" class="row">
                                <div class="small-12 xlarge-10 text-center xlarge-centered columns">
                                    <h2>
                                        <a class="a-secondary" v-html="seo2.section.text" v-bind:href="seo2.section.link" v-bind:data-description="seo2.section.description" v-bind:data-sectionDescription="seo2.section.description" data-type="Section"></a>
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <div class="small-11 small-centered columns">
                            <div class="row">
                                <template v-for="(item, index) in seo2Sections">
                                    <div v-bind:class="classNameBlockGrid(seo2Sections,viewportSize) + ' productContainer text-center content'">
                                        <div class="responsively-lazy preventReflow">
                                            <a v-bind:href="item.image.link" v-bind:data-description="item.image.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="seo2.section.description" data-type="Image">
                                                <img v-bind:data-srcset="responsiveImage(item.item, item.image.customImage.large, item.image.customImage.small)" v-bind:src="item.image.customImage.large ? item.image.customImage.large : productImgPath(item.item,640)" v-bind:alt="item.cta.text"/>
                                            </a>
                                        </div>
                                        <h4><a class="a-secondary" v-html="item.cta.text" v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-itemNumber="item.item" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="seo2.section.description" data-type="CTA"></a></h4>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template v-if="viewportSize != 'small'">
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
                                        <span v-html="seo1.section.text"></span>
                                        <div class="displayInline">
                                            <template v-for="(item, index) in seo1Sections">
                                                <a v-html="item.cta.text" v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-sectionDescription="seo1.section.description" v-bind:data-cta="item.cta.text" data-type="CTA" class="body-small-crumbs"></a>
                                            </template>
                                        </div>
                                    </div>

                                    <div>
                                        <span v-html="seo2.section.text"></span>
                                        <div class="displayInline">
                                            <template v-for="(item, index) in seo2Sections">
                                                <a v-html="item.cta.text" v-bind:href="item.cta.link" v-bind:data-description="item.cta.description" v-bind:data-cta="item.cta.text" v-bind:data-sectionDescription="seo2.section.description"  data-type="CTA" class="body-small-crumbs"></a>
                                            </template>
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
            </template>
        </section>`
})

Vue.component('hp-container', {
    data: function()  {
        return {
            componentList: [],
            viewPort: 'small'
        }
    },
    created: function () {
        Object.keys(mappingOrder).forEach((letter, i) => {
            this.componentList.push(mappingOrder[letter]);
        });
        window.addEventListener('resize', this.breakpointValue);
        this.breakpointValue();
    },
    methods: {
        breakpointValue: function() {
            var size = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');
            this.viewPort = size;
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.breakpointValue);
        }
    },
    watch: {
        viewPort: function () {
            var moduleOrder = [];
            this.$nextTick(function () {
                var sectionsDisplayed = Array.from(document.getElementById('hp_modules').querySelectorAll('section'));
                var alphaOrder = [];
                var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                var counter = 0;

                sectionsDisplayed.forEach((el,index) => {
                    var anchorEl = Array.from(el.querySelectorAll('a'))
                    var moduleType = el.getAttribute("data-module-type");
                    var alphaChar = alpha.charAt(index);
                    anchorEl.forEach((aTag,i) => {
                        var linkNumber = i+1;
                        var dataType = aTag.getAttribute("data-type");
                        var dataDescription = aTag.getAttribute('data-description').split(' ').join('_');

                        if(dataDescription != '') {
                            dataDescription = '_'+dataDescription;
                        }

                        var trackingCode = 'hp_module_' + alphaChar + linkNumber + '_'+ dataType + '_' + moduleType + dataDescription;
                        var trackingLink = aTag.getAttribute("href");

                        var ctaText = aTag.getAttribute("data-cta") ? aTag.getAttribute("data-cta") : 'NA';
                        var itemNumber = aTag.getAttribute("data-itemNumber") ? aTag.getAttribute("data-itemNumber") : "NA";
                        var sectionDescription = aTag.getAttribute("data-sectionDescription") ? aTag.getAttribute("data-sectionDescription") : 'NA';

                        var id = alphaChar + linkNumber + '_' + moduleType;
                        var name = ctaText.replace(/'/g, "")+'_'+trackingLink.replace(/\/\/www.uncommongoods.com/g, '').replace("//blog.uncommongoods.com","/blog");
                        var creative = itemNumber;
                        var pos = sectionDescription;

                        trackingLink = trackingLink.replace(/\/\/www.uncommongoods.com/g, '');

                        if (trackingLink !== '' && moduleType != 'TL_SEO') {
                            if (trackingLink.includes("//blog.uncommongoods.com")) {
                                trackingLink = trackingLink.replace("//blog.uncommongoods.com","/blog");
                                $(aTag).attr("onclick", `javascript: pageTracker._trackPageview('/internal`+trackingLink+`?source=`+trackingCode+`');dataLayer.push({'internalHPModuleLinkUrl':'/internal`+trackingLink+`?source=`+trackingCode+`'},{'event':'fireGTMTrackHPModulePageView'});onPromoClick('`+id+`', '`+name+`', '`+creative+`', '`+pos+`')`);
                            } else {
                                $(aTag).attr("onclick", `javascript: pageTracker._trackPageview('/internal`+trackingLink+`?source=`+trackingCode+`');dataLayer.push({'internalHPModuleLinkUrl':'/internal`+trackingLink+`?source=`+trackingCode+`'},{'event':'fireGTMTrackHPModulePageView'});onPromoClick('`+id+`', '`+name+`', '`+creative+`', '`+pos+`')`);
                            }
                        } else if (trackingLink !== '' && moduleType === 'TL_SEO') {
                            $(aTag).attr("onclick", `javascript: pageTracker._trackPageview('/internal`+trackingLink+`?source=`+trackingCode+`');dataLayer.push({'internalHPModuleLinkUrl':'/internal`+trackingLink+`?source=`+trackingCode+`'},{'event':'fireGTMTrackHPModulePageView'});onPromoClick('`+id+`', '`+name+`', '`+creative+`', '`+pos+`')`);
                        } else {
                            $(aTag).attr("onclick", `javascript: pageTracker._trackPageview('/internal`+trackingLink+`?source=`+trackingCode+`');dataLayer.push({'internalHPModuleLinkUrl':'/internal`+trackingLink+`?source=`+trackingCode+`'},{'event':'fireGTMTrackHPModulePageView'});onPromoClick('`+id+`', '`+name+`', '`+creative+`', '`+pos+`')`);
                            $('a[href=""]').click(function (event) { // where href are blank
                                event.preventDefault();
                            })
                        }

                    })
                })
            })
        }
    },
    template: `
        <div class="small-12 columns">
            <template v-for="(obj, index) in componentList" key="index">
                <component :is="Object.keys(obj)[0]" :module-data="obj[Object.keys(obj)[0]]" :viewport-size="viewPort"></component>
            </template>
        </div>`
})

var hp_modules = new Vue({
    el: '#hp_modules',
    data: {
        hpJson: mappingOrder
    }
})

Vue.nextTick(function () {
    var sectionsDisplayed = Array.from(document.getElementById('hp_modules').querySelectorAll('section'));
    var alphaOrder = [];
    var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var counter = 0;

    sectionsDisplayed.forEach((el,index) => {
        var anchorEl = Array.from(el.querySelectorAll('a'))
        var moduleType = el.getAttribute("data-module-type");
        var alphaChar = alpha.charAt(index);
        anchorEl.forEach((aTag,i) => {
            var linkNumber = i+1;
            var dataType = aTag.getAttribute("data-type");
            var dataDescription = aTag.getAttribute('data-description').split(' ').join('_');

            if(dataDescription != '') {
                dataDescription = '_'+dataDescription;
            }

            var trackingCode = 'hp_module_' + alphaChar + linkNumber + '_'+ dataType + '_' + moduleType + dataDescription;
            var trackingLink = aTag.getAttribute("href");

            var ctaText = aTag.getAttribute("data-cta") ? aTag.getAttribute("data-cta") : 'NA';
            var itemNumber = aTag.getAttribute("data-itemNumber") ? aTag.getAttribute("data-itemNumber") : "NA";
            var sectionDescription = aTag.getAttribute("data-sectionDescription") ? aTag.getAttribute("data-sectionDescription") : 'NA';

            var id = alphaChar + linkNumber + '_' + moduleType;
            var name = ctaText.replace(/'/g, "")+'_'+trackingLink.replace(/\/\/www.uncommongoods.com/g, '').replace("//blog.uncommongoods.com","/blog");
            var creative = itemNumber;
            var pos = sectionDescription;

            trackingLink = trackingLink.replace(/\/\/www.uncommongoods.com/g, '');

            if (trackingLink !== '' && moduleType != 'TL_SEO') {
                if (trackingLink.includes("//blog.uncommongoods.com")) {
                    trackingLink = trackingLink.replace("//blog.uncommongoods.com","/blog");
                    $(aTag).attr("onclick", `javascript: pageTracker._trackPageview('/internal`+trackingLink+`?source=`+trackingCode+`');dataLayer.push({'internalHPModuleLinkUrl':'/internal`+trackingLink+`?source=`+trackingCode+`'},{'event':'fireGTMTrackHPModulePageView'});onPromoClick('`+id+`', '`+name+`', '`+creative+`', '`+pos+`')`);
                } else {
                    $(aTag).attr("onclick", `javascript: pageTracker._trackPageview('/internal`+trackingLink+`?source=`+trackingCode+`');dataLayer.push({'internalHPModuleLinkUrl':'/internal`+trackingLink+`?source=`+trackingCode+`'},{'event':'fireGTMTrackHPModulePageView'});onPromoClick('`+id+`', '`+name+`', '`+creative+`', '`+pos+`')`);
                }
            } else if (trackingLink !== '' && moduleType === 'TL_SEO') {
                $(aTag).attr("onclick", `javascript: pageTracker._trackPageview('/internal`+trackingLink+`?source=`+trackingCode+`');dataLayer.push({'internalHPModuleLinkUrl':'/internal`+trackingLink+`?source=`+trackingCode+`'},{'event':'fireGTMTrackHPModulePageView'});onPromoClick('`+id+`', '`+name+`', '`+creative+`', '`+pos+`')`);
            } else {
                $(aTag).attr("onclick", `javascript: pageTracker._trackPageview('/internal`+trackingLink+`?source=`+trackingCode+`');dataLayer.push({'internalHPModuleLinkUrl':'/internal`+trackingLink+`?source=`+trackingCode+`'},{'event':'fireGTMTrackHPModulePageView'});onPromoClick('`+id+`', '`+name+`', '`+creative+`', '`+pos+`')`);
                $('a[href=""]').click(function (event) { // where href are blank
                    event.preventDefault();
                })
            }
        })
    })
})
