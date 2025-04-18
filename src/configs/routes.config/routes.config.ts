import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'
import { components } from 'react-select'

export const publicRoutes: Routes = [
    ...authRoute,
    {
        key: 'test',
        path: '/test',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
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
        authority: [],
    },
    {
        key: 'provider.view',
        path: '/provider/view',
        component: lazy(() => import('@/views/provider/ViewAllProvider')),
        authority: [],
    },
    {
        key: 'provider.edit',
        path: '/provider/edit',
        component: lazy(() => import('@/views/provider/EditProvider')),
        authority: [],
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
        component: lazy(
            () => import('@/views/healthplan/CreateHealthPlanCategory'),
        ),
        authority: [],
    },
    // view single page for health plan category
    {
        key: 'healthplan.category.single.view',
        path: '/healthplan/category/singleview',
        component: lazy(
            () => import('@/views/healthplan/SingleViewHealthPlanCategory'),
        ),
        authority: [],
    },
    // attach health plan benefits
    {
        key: 'healthplan.benefit.attach',
        path: '/healthplan/benefits/attach',
        component: lazy(
            () => import('@/views/healthplan/AttachHealthPlanBenefit'),
        ),
        authority: [],
    },
    // edit heath plan benefits
    {
        key: 'healthplan.benefit.attach',
        path: '/healthplan/benefits/attach/edit',
        component: lazy(
            () => import('@/views/healthplan/EditAttachHealthPlanBenefit'),
        ),
        authority: [],
    },
    // create nhia drug tarrif
    {
        key: 'nhia.tarrif.drugs.create',
        path: 'nhia/tarrif/drugs/create',
        component: lazy(() => import('@/views/nhis/CreateDrugs')),
        authority: [],
    },
    // view nhia drug tarrif
    {
        key: 'nhia.tarrif.drugs.view',
        path: 'nhia/tarrif/drugs/view',
        component: lazy(() => import('@/views/nhis/ViewDrugsTarrif')),
        authority: [],
    },
    {
        key: 'nhia.healthplan.service.view',
        path: 'nhia/healthplan/service/view',
        component: lazy(() => import('@/views/nhis/ViewService')),
        authority: [],
    },
    // to view the Nhis Tarrif Service
    {
        key: 'nhia.tarrif.services.view',
        path: 'nhia/tarrif/services/view',
        component: lazy(() => import('@/views/nhis/ViewServiceTarrif')),
        authority: [],
    },
    // create Nhis Tarrif Service
    {
        key: 'nhia.tarrif.services.create',
        path: 'nhia/tarrif/services/create',
        component: lazy(() => import('@/views/nhis/CreateServiceTarrif')),
        authority: [],
    },
    // view nhia enrollee
    {
        key: 'nhia.enrollee.view',
        path: 'nhia/enrollee/view',
        component: lazy(() => import('@/views/enrollee/ViewNHIAEnrollee')),
        authority: [],
    },
    // create nhia enrollee
    {
        key: 'nhia.enrollee.create',
        path: 'nhia/enrollee/create',
        component: lazy(() => import('@/views/enrollee/CreateNHIAEnrollee')),
        authority: [],
    },
    {
        key: 'nhia.enrollee.private',
        path: 'privates/viewclients',
        component: lazy(() => import('@/views/privates/ViewClients')),
        authority: [],
    },
    {
        key: 'nhia.enrollee.onboard',
        path: 'privates/enrollee/onboard',
        component: lazy(() => import('@/views/privates/Onboarding')),
        authority: [],
    },
    {
      key: 'nhia.enrollee.comapanyinfo',
      path: 'privates/enrollee/companyinfo',
      component: lazy(() => import('@/views/privates/CompanyInfo')),
      authority: [],
  },
   {
    key: 'nhia.enrollee.enroleeview',
    path: 'privates/enrollee/view',
    component: lazy(() => import('@/views/privates/ViewPrivateEnrollees')),
    authority: [],
   },
   {
   key: 'nhia.enrollee.comapanyinfo',
   path: 'privates/enrollee/add',
   component: lazy(() => import('@/views/privates/EnrolleeEntryForm')),
   authority: [],
  },
    // create nhia claims
    {
        key: 'nhia.claims.create',
        path: 'nhia/claims/create',
        component: lazy(() => import('@/views/nhis/CreateClaims')),
        authority: [],
    },
    // manage users/users permission
    {
        key: 'manage.user',
        path: '/manage/user',
        component: lazy(() => import('@/views/profile/UserPermissions')),
        authority: [],
    },


]
