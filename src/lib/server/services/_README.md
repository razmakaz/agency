The services layer contains utility functions and business logic outside of the repos and schemas, before getting to the Presentation layer.

There's a "Servicer.ts" file that exports an object containing all services. You may import individual services, but importing Servicer provides access to all services.