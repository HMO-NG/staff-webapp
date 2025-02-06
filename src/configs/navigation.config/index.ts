import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/home',
        title: 'Home',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'provider',
        path: '',
        title: 'Provider Menu',
        translateKey: 'nav.provider.create',
        icon: 'singleMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'provider.create',
                path: '/provider/create',
                title: 'Add Provider',
                translateKey: 'nav.provider.create',
                icon: 'singleMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: []
            },
            {
                key: 'provider.view',
                path: '/provider/view',
                title: 'View Provider',
                translateKey: 'nav.provider.view',
                icon: 'groupCollapseMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: []
            },
        ]
    },
    // health plan
    {
        key: 'healthplan-title',
        path: '',
        title: '',
        translateKey: 'Health Plan',
        icon: '',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            // health plan menu
            {
                key: 'healthplan-menu',
                path: '',
                title: 'Health Plan Menu',
                translateKey: 'nav.healthplan.create',
                icon: 'menu',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    // view health plan category
                    {
                        key: 'healthplan.category.view',
                        path: '/healthplan/category/view',
                        title: 'View Plan Category',
                        translateKey: 'nav.healthplan.category.view',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: []
                    },
                    // view health plan
                    {
                        key: 'healthplan.view',
                        path: '/healthplan/view',
                        title: 'View Plan',
                        translateKey: 'nav.healthplan.view',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: []
                    },
                    // view health plan benefits
                    {
                        key: 'healthplan.benefits.view',
                        path: '/healthplan/benefits/view',
                        title: 'View Benefits',
                        translateKey: 'healthplan.benefits.view',
                        icon: 'groupCollapseMenu',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: []
                    },
                    // TODO REMOVE IF NOT LATER USED.
                    // // attach health plan benefits
                    // {
                    //     key: 'healthplan.benefits.attach',
                    //     path: '/healthplan/benefits/attach',
                    //     title: 'Attach Benefits',
                    //     translateKey: 'healthplan.benefits.attach',
                    //     icon: 'groupCollapseMenu',
                    //     type: NAV_ITEM_TYPE_ITEM,
                    //     authority: [],
                    //     subMenu: []
                    // },
                ]
            },
        ],
    },
    // enrollee
    {
        key: 'enrollee-title',
        path: '',
        title: '',
        translateKey: 'Enrollment',
        icon: '',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            {
                key: 'enrollee-nhia',
                path: '',
                title: 'Create Enrollees',
                translateKey: 'enrollee-nhia',
                icon: 'hiIdentification',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    // create nhia enrollees
                    {
                        key: 'nhia.enrollee.view',
                        path: 'nhia/enrollee/view',
                        title: 'View NHIA Enrollees',
                        translateKey: 'nhia.enrollee.create',
                        icon: 'groupCollapseMenu',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: []
                    },


                  // create private enrollees
                  {
                      key: 'nhia.enrollee.private',
                      path: 'privates/enrollee',
                      title: 'View Privates',
                      translateKey: 'nhia.enrollee.private',
                      icon: 'groupCollapseMenu',
                      type: NAV_ITEM_TYPE_ITEM,
                      authority: [],
                      subMenu: []
                  },
              ]
            },
        ],
    },
    // nhis
    {
        key: 'nhis-title',
        path: '',
        title: '',
        translateKey: 'nhis',
        icon: '',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            {
                key: 'nhia.service',
                path: '',
                title: 'Tarrif',
                translateKey: 'nhia.service',
                icon: 'groupCollapseMenu',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'nhia.tarrif.services.view',
                        path: 'nhia/tarrif/services/view',
                        title: 'View Services',
                        translateKey: 'nhia.tarrif.services.view',
                        icon: 'groupCollapseMenu',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: []
                    },
                    // view nhia drug tarrif
                    {
                        key: 'nhia.tarrif.drugs.view',
                        path: 'nhia/tarrif/drugs/view',
                        title: 'View Drugs',
                        translateKey: 'nhia.tarrif.drugs.view',
                        icon: 'groupCollapseMenu',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: []
                    },
                ]
            },
            {
                key: 'nhia.claims',
                path: '',
                title: 'Claims',
                translateKey: 'nhia.claims',
                icon: 'groupCollapseMenu',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'nhia.claims.create',
                        path: 'nhia/claims/create',
                        title: 'Create Claims',
                        translateKey: 'nhia.claim.create',
                        icon: 'groupCollapseMenu',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: []
                    },
                    {
                        key: 'nhia.claim.code.create',
                        path: 'nhia/claim/code/create',
                        title: 'Get PA Codes',
                        translateKey: 'nhia.claim.code.create',
                        icon: 'groupCollapseMenu',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: []
                    },
                ]
            }
        ],
    }

    /** Example purpose only, please remove */
    // {
    //     key: 'collapseMenu',
    //     path: '',
    //     title: 'Collapse Menu',
    //     translateKey: 'nav.collapseMenu.collapseMenu',
    //     icon: 'collapseMenu',
    //     type: NAV_ITEM_TYPE_COLLAPSE,
    //     authority: [],
    //     subMenu: [
    //         {
    //             key: 'collapseMenu.item1',
    //             path: '/collapse-menu-item-view-1',
    //             title: 'Collapse menu item 1',
    //             translateKey: 'nav.collapseMenu.item1',
    //             icon: '',
    //             type: NAV_ITEM_TYPE_ITEM,
    //             authority: [],
    //             subMenu: [],
    //         },
    //         {
    //             key: 'collapseMenu.item2',
    //             path: '/collapse-menu-item-view-2',
    //             title: 'Collapse menu item 2',
    //             translateKey: 'nav.collapseMenu.item2',
    //             icon: '',
    //             type: NAV_ITEM_TYPE_ITEM,
    //             authority: [],
    //             subMenu: [],
    //         },
    //     ],
    // },
    // {
    //     key: 'groupMenu',
    //     path: '',
    //     title: 'Group Menu',
    //     translateKey: 'nav.groupMenu.groupMenu',
    //     icon: '',
    //     type: NAV_ITEM_TYPE_TITLE,
    //     authority: [],
    //     subMenu: [
    //         {
    //             key: 'groupMenu.single',
    //             path: '/group-single-menu-item-view',
    //             title: 'Group single menu item',
    //             translateKey: 'nav.groupMenu.single',
    //             icon: 'groupSingleMenu',
    //             type: NAV_ITEM_TYPE_ITEM,
    //             authority: [],
    //             subMenu: [],
    //         },
    //         {
    //             key: 'groupMenu.collapse',
    //             path: '',
    //             title: 'Group collapse menu',
    //             translateKey: 'nav.groupMenu.collapse.collapse',
    //             icon: 'groupCollapseMenu',
    //             type: NAV_ITEM_TYPE_COLLAPSE,
    //             authority: [],
    //             subMenu: [
    //                 {
    //                     key: 'groupMenu.collapse.item1',
    //                     path: '/group-collapse-menu-item-view-1',
    //                     title: 'Menu item 1',
    //                     translateKey: 'nav.groupMenu.collapse.item1',
    //                     icon: '',
    //                     type: NAV_ITEM_TYPE_ITEM,
    //                     authority: [],
    //                     subMenu: [],
    //                 },
    //                 {
    //                     key: 'groupMenu.collapse.item2',
    //                     path: '/group-collapse-menu-item-view-2',
    //                     title: 'Menu item 2',
    //                     translateKey: 'nav.groupMenu.collapse.item2',
    //                     icon: '',
    //                     type: NAV_ITEM_TYPE_ITEM,
    //                     authority: [],
    //                     subMenu: [],
    //                 },
    //             ],
    //         },
    //     ],
    // },
]

export default navigationConfig
