import { convertToList } from 'services/website/pages/Builder/helpers';

//import { BiographyTemplate, BiographyDefaultProps } from './Biography';
//import HeaderTemplate from './Header/template';
//import FeaturesTemplate from './Feature/template';
//import FooterTemplate from './Footer/template';

import { NavAProps } from './Nav/defaults';
import { FooterAProps } from './Footer/defaults';
import { CtaAProps } from './Cta/defaults';
import { HeaderAProps, HeaderBProps, HeaderCProps } from './Header/defaults';
import { ContentAProps, ContentBProps } from './Content/defaults';
import {
    FeatureAProps,
    FeatureBProps,
    FeatureCProps,
} from './Feature/defaults';

import ContainerTemplate from './Container/template';

import ContentATemplate from './Content/a';
import ContentBTemplate from './Content/b';
import ContentCTemplate from './Content/c';
import ContactATemplate from './Contact/a';
import ContactBTemplate from './Contact/b';
import ContactCTemplate from './Contact/c';
import CtaATemplate from './Cta/a';
import CtaBTemplate from './Cta/b';
import CtaCTemplate from './Cta/c';
import FeatureATemplate from './Feature/a';
import FeatureBTemplate from './Feature/b';
import FeatureCTemplate from './Feature/c';
import FooterATemplate from './Footer/a';
import FooterBTemplate from './Footer/b';
import FooterCTemplate from './Footer/c';
import GalleryATemplate from './Gallery/a';
import GalleryBTemplate from './Gallery/b';
import GalleryCTemplate from './Gallery/c';
import NavATemplate from './Nav/a';
import NavBTemplate from './Nav/b';
import NavCTemplate from './Nav/c';
import HeaderATemplate from './Header/a';
import HeaderBTemplate from './Header/b';
import HeaderCTemplate from './Header/c';
import PricingATemplate from './Pricing/a';
import PricingBTemplate from './Pricing/b';
import StatsATemplate from './Stats/a';
import StatsBTemplate from './Stats/b';
import StatsCTemplate from './Stats/c';

import MintATemplate from './Mint/a';

const templatesArray = [
    { key: 'Content_A', template: ContentATemplate, defaults: ContentAProps },
    { key: 'Content_B', template: ContentBTemplate, defaults: ContentBProps },

    { key: 'CTA_A', template: CtaATemplate, defaults: CtaAProps },

    { key: 'Feature_A', template: FeatureATemplate, defaults: FeatureAProps },
    { key: 'Feature_B', template: FeatureBTemplate, defaults: FeatureBProps },
    { key: 'Feature_C', template: FeatureCTemplate, defaults: FeatureCProps },

    { key: 'Hero_A', template: HeaderATemplate, defaults: HeaderAProps },
    { key: 'Hero_B', template: HeaderBTemplate, defaults: HeaderBProps },
    { key: 'Hero_C', template: HeaderCTemplate, defaults: HeaderCProps },

    { key: 'Footer_A', template: FooterATemplate, defaults: FooterAProps },
    { key: 'Header_A', template: NavATemplate, defaults: NavAProps },

    // depreciated
    /*
	{key: 'Header_B', template: NavBTemplate},
	{key: 'Header_C', template: NavCTemplate},
	{key: 'Footer_B', template: FooterBTemplate},
	{key: 'Footer_C', template: FooterCTemplate},

	{key: 'CTA_B', template: CtaBTemplate},
	{key: 'CTA_C', template: CtaCTemplate},

	{key: 'Mint_A', template: MintATemplate},

	{key: 'Content_C', template: ContentCTemplate},

	{key: 'Contact_A', template: ContactATemplate},
	{key: 'Contact_B', template: ContactBTemplate},
	{key: 'Contact_C', template: ContactCTemplate},

	{key: 'Pricing_A', template: PricingATemplate},
	{key: 'Pricing_B', template: PricingBTemplate},
	{key: 'Statistic_A', template: StatsATemplate},
	{key: 'Statistic_B', template: StatsBTemplate},
	{key: 'Statistic_C', template: StatsCTemplate},

	{key: 'Gallery_A', template: GalleryATemplate},
	{key: 'Gallery_B', template: GalleryBTemplate},
	{key: 'Gallery_C', template: GalleryCTemplate},
	*/
    //{key: 'Biography', template: BiographyTemplate, defaults: BiographyDefaultProps},
    //{key: 'Header', template: HeaderTemplate, defaults: HeaderDefaultProps},
    //{key: 'Footer', template: FooterTemplate},
    //{key: 'Features', template: FeaturesTemplate},
    { key: 'Container', template: ContainerTemplate },
];

//console.log(convertToList(templatesArray, 'key'))

// Turns into working templates
export default convertToList(templatesArray, 'key');
