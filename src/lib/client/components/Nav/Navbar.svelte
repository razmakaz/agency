<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	const categories = [
		{
			id: 'main',
			label: 'Main',
			icon: 'iconamoon:home-fill',
			items: [
				{
					id: 'home',
					label: 'Home',
					href: '/'
				},
				{
					id: 'reports',
					label: 'Reports',
					href: '/reports'
				}
			]
		},
		{
			id: 'money',
			label: 'Money',
			icon: 'teenyicons:money-solid',
			items: [
				{
					id: 'distributions',
					label: 'Distributions',
					href: '/money/distributions'
				},
				{
					id: 'invoices',
					label: 'Invoices',
					href: '/money/invoices'
				},
				{
					id: 'payroll',
					label: 'Payroll',
					href: '/money/payroll'
				}
			]
		},
		{
			id: 'people',
			label: 'People',
			icon: 'fluent:people-interwoven-16-filled',
			items: [
				{
					id: 'partners',
					label: 'Partners',
					href: '/people/partners'
				},
				{
					id: 'organizations',
					label: 'Organizations',
					href: '/people/organizations'
				},
				{
					id: 'clients',
					label: 'Clients',
					href: '/people/clients'
				},
				{
					id: 'associates',
					label: 'Associates',
					href: '/people/associates'
				}
			]
		},
		{
			id: 'assignments',
			label: 'Assignments',
			icon: 'tabler:clock-filled',
			items: [
				{
					id: 'jobs',
					label: 'Jobs',
					href: '/assignments/jobs'
				},
				{
					id: 'shifts',
					label: 'Shifts',
					href: '/assignments/timesheets'
				},
				{
					id: 'approvals',
					label: 'Approvals',
					href: '/assignments/timesheets'
				},
				{
					id: 'expenses',
					label: 'Expenses',
					href: '/assignments/timesheets'
				}
			]
		},
		{
			id: 'resources',
			label: 'Resources',
			icon: 'mdi:library-books',
			items: [
				{
					id: 'library',
					label: 'Library',
					href: '/resources/library'
				},
				{
					id: 'contracts',
					label: 'Contracts',
					href: '/resources/contracts'
				}
			]
		},
		{
			id: 'users',
			label: 'Users',
			icon: 'mdi:account-group',
			items: [
				{
					id: 'users',
					label: 'Users',
					href: '/settings/users'
				},
				{
					id: 'permissions',
					label: 'Permissions',
					href: '/settings/roles'
				}
			]
		},
		{
			id: 'technical',
			label: 'Technical',
			icon: 'mdi:cog-outline',
			items: [
				{
					id: 'whitelabel',
					label: 'Whitelabel',
					href: '/settings/whitelabel'
				},
				{
					id: 'integrations',
					label: 'Integrations',
					href: '/settings/integrations'
				},
				{
					id: 'api-keys',
					label: 'API Keys',
					href: '/settings/api-keys'
				},
				{
					id: 'automation',
					label: 'Automation',
					href: '/settings/automation'
				},
				{
					id: 'webhooks',
					label: 'Webhooks',
					href: '/settings/webhooks'
				},
				{
					id: 'emails',
					label: 'Email Logs',
					href: '/settings/emails'
				},
				{
					id: 'mcp',
					label: 'MCP',
					href: '/settings/mcp'
				}
			]
		}
	];
</script>

<div class="bg-primary/10 hidden h-screen min-w-64 overflow-y-auto lg:block">
	<div class="grid h-full grid-rows-[auto_auto_1fr]">
		<div class="bg-primary text-primary-content p-4">Header</div>
		<div class="from-primary/50 to-primary/0 h-4 bg-gradient-to-b"></div>
		<div class="flex flex-col px-3">
			{#each categories as category}
				<div class="text-base-content/50 mt-2 mb-2 flex items-center gap-2 text-sm font-bold">
					<Icon icon={category.icon || ''} class="h-6 w-6" width="32" height="32" />
					{category.label}
					<!-- <div class="bg-base-content/20 ml-auto h-px w-full"></div> -->
				</div>
				{#each category.items as item}
					<div class="grid grid-cols-[auto_1fr] items-center gap-2">
						<div class="bg-base-content/20 h-full w-px" style="margin-left: 11px"></div>
						<button
							onclick={() => goto(item.href)}
							class="hover:bg-primary/50 mt-1 grid grid-cols-[1fr] justify-start gap-2 rounded-md p-2 transition-all duration-100"
						>
							<div class="text-left font-semibold">{item.label}</div>
						</button>
					</div>
				{/each}
			{/each}
		</div>
	</div>
</div>
