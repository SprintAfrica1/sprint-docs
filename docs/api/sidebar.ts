import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/sprint-connect-api",
    },
    {
      type: "category",
      label: "Interstate",
      items: [
        {
          type: "doc",
          id: "api/interstate-bulk-rates-create",
          label: "Request a bulk interstate quote",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/interstate-bulk-shipments-create",
          label: "Create a bulk interstate shipment",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Local",
      items: [
        {
          type: "doc",
          id: "api/local-bulk-rates-create",
          label: "Request a bulk local quote",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/local-bulk-shipments-create",
          label: "Create a bulk local shipment",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/local-rates-create",
          label: "Request a local quote",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/local-shipments-create",
          label: "Create a local shipment",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Rates",
      items: [
        {
          type: "doc",
          id: "api/rates-create",
          label: "Get a delivery quote",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Shipments",
      items: [
        {
          type: "doc",
          id: "api/shipments-list",
          label: "List shipments",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/shipments-create",
          label: "Create a shipment",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/shipments-batch-read",
          label: "Get a bulk batch",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/shipments-catchup-list",
          label: "Catch up on events",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/shipments-read",
          label: "Get a shipment",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/shipments-events-list",
          label: "Get events for a shipment",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Tracking",
      items: [
        {
          type: "doc",
          id: "api/tracking-read",
          label: "Track a shipment",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Schemas",
      items: [
        {
          type: "doc",
          id: "api/schemas/merchantportalinterstatebulkpackage",
          label: "MerchantPortalInterstateBulkPackage",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportalinterstatebulkraterequest",
          label: "MerchantPortalInterstateBulkRateRequest",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportalinterstatebulkrateresponse",
          label: "MerchantPortalInterstateBulkRateResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportalinterstatebulkshipmentcreate",
          label: "MerchantPortalInterstateBulkShipmentCreate",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportalinterstatebulkshipmentresponse",
          label: "MerchantPortalInterstateBulkShipmentResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportallocalbulkpackage",
          label: "MerchantPortalLocalBulkPackage",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportallocalbulkraterequest",
          label: "MerchantPortalLocalBulkRateRequest",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportallocalbulkrateresponse",
          label: "MerchantPortalLocalBulkRateResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportallocalbulkshipmentcreate",
          label: "MerchantPortalLocalBulkShipmentCreate",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportallocalbulkshipmentresponse",
          label: "MerchantPortalLocalBulkShipmentResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportallocalraterequest",
          label: "MerchantPortalLocalRateRequest",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportallocalrateresponse",
          label: "MerchantPortalLocalRateResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportallocalshipmentcreate",
          label: "MerchantPortalLocalShipmentCreate",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportallocalshipmentresponse",
          label: "MerchantPortalLocalShipmentResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportalraterequest",
          label: "MerchantPortalRateRequest",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportalrateresponse",
          label: "MerchantPortalRateResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportalshipmentcreate",
          label: "MerchantPortalShipmentCreate",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportalshipmentresponse",
          label: "MerchantPortalShipmentResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportalshipmentevent",
          label: "MerchantPortalShipmentEvent",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportalshipmentcatchup",
          label: "MerchantPortalShipmentCatchup",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportalshipmenteventlist",
          label: "MerchantPortalShipmentEventList",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportaltrackingjourney",
          label: "MerchantPortalTrackingJourney",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportaltrackingevent",
          label: "MerchantPortalTrackingEvent",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/merchantportaltrackingresponse",
          label: "MerchantPortalTrackingResponse",
          className: "schema",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
