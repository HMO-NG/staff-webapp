import {lazy} from 'react'
import authRoute from './authRoute'
import type {Routes} from '@/@types/routes'
import {components} from 'react-select'

export const publicRoutes: Routes = [...authRoute,
    {
        key: 'test',
        path: '/test',
        component: lazy(() => import('@/views/Home')),
        authority: []
    }
]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    {
        key: 'provider.create',
        path: '/provider/create',
        component: lazy(() => import('@/views/provider/CreateProvider')),
        authority: []
    },
    {
        key: 'provider.view',
        path: '/provider/view',
        component: lazy(() => import('@/views/provider/ViewAllProvider')),
        authority: []
    },
    {
        key: 'provider.edit',
        path: '/provider/edit',
        component: lazy(() => import('@/views/provider/EditProvider')),
        authority: []
    },
    {
        key: 'healthplan.create',
        path: '/healthplan/create',
        component: lazy(() => import('@/views/healthplan/CreateHealthPlan')),
        authority: [],
    },
    // view health plans
    {
        key: 'healthplan.view',
        path: '/healthplan/view',
        component: lazy(() => import('@/views/healthplan/ViewHealthPlan')),
        authority: [],
    },

    // view health plan benefits
    {
        key: 'healthplan.benefits.view',
        path: '/healthplan/benefits/view',
        component: lazy(() => import('@/views/healthplan/ViewBenefits')),
        authority: [],
    },
    // create health plan benefits
    {
        key: 'healthplan.benefits.create',
        path: '/healthplan/benefits/create',
        component: lazy(() => import('@/views/healthplan/CreateBenefits')),
        authority: [],
    },
    // view plan category
    {
        key: 'healthplan.category.view',
        path: '/healthplan/category/view',
        component: lazy(() => import('@/views/healthplan/ViewPlanCategory')),
        authority: [],
    },
    // create health plan category
    {
        key: 'healthplan.category.create',
        path: '/healthplan/category/create',
        component: lazy(() => import('@/views/healthplan/CreateHealthPlanCategory')),
        authority: [],
    },
    {
        key: 'nhia.healthplan.drugs.create',
        path: 'nhia/healthplan/drugs/create',
        component: lazy(() => import('@/views/nhis/CreateDrugs')),
        authority: [],
    },
    {
        key: 'nhia.healthplan.service.view',
        path: 'nhia/healthplan/service/view',
        component: lazy(() => import('@/views/nhis/ViewService')),
        authority: [],
    },
    // to view the Nhis procedures
    {
        key: 'nhia.services.procedures.view',
        path: 'nhia/services/procedures/view',
        component: lazy(() => import('@/views/nhis/viewProcedure')),
        authority: [],
    },
    /** Example purpose only, please remove */
    {
        key: 'collapseMenu.item1',
        path: '/collapse-menu-item-view-1',
        component: lazy(() => import('@/views/demo/CollapseMenuItemView1')),
        authority: [],
    },
    {
        key: 'collapseMenu.item2',
        path: '/collapse-menu-item-view-2',
        component: lazy(() => import('@/views/demo/CollapseMenuItemView2')),
        authority: [],
    },
    {
        key: 'groupMenu.single',
        path: '/group-single-menu-item-view',
        component: lazy(() =>
            import('@/views/demo/GroupSingleMenuItemView')
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item1',
        path: '/group-collapse-menu-item-view-1',
        component: lazy(() =>
            import('@/views/demo/GroupCollapseMenuItemView1')
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item2',
        path: '/group-collapse-menu-item-view-2',
        component: lazy(() =>
            import('@/views/demo/GroupCollapseMenuItemView2')
        ),
        authority: [],
    },
]