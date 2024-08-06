# Register/Setup new Device.

## Pre-requisites.
## Inputs.
- **GUID** (`Guid`): Generic Unique Identifier.

## Main Flow.

  ### Steps:
  1. The user navigates to devices/setup page.
  1. When the view loads, it checks if Bluetooth is available: either BT adapter not present or BT is turned off.
  1. If BT is available, then it shows a button to Scan for BT devices.
      1. The UI shows up a Device chooser. Only devices with GUID `{GUID}` should be listed.
  1. The user selects a device with the GUID `{GUID}`
  1. The system tries to connect to the device GATT Primary Service.
  1. When successfully connected to the GATT Primary Service, the UI shows the [Network Setup Form](#network-setup-form).
  1. The user fills the Network Setup form and clicks the Continue button.
  1. The system, still connected to the BT device, writes the Wifi credentials info into the GATT Write Characteristic with GUID `{GUID}`.
  1. If the BT device responds with a success status code, then end BT connection.
  1. When disconnected, proceed with registering the Device by making an API call to [`PgotchiWebApi.Device.RegisterDevice`](#apis).
  1. When [`PgotchiWebApi.Device.RegisterDevice`](#apis) call succeeds, the UI shows the [Device Info Form](#device-info-form).

  ### Outputs:

## Alternate Flow.
  ### Steps:
  ### Outputs:

## Components.
  ### APIs
  - PgotchiWebApi
    - Device
      - RegisterDevice

  ### UI Components
  - **Device Info Form.**  \
  Registers a new device.
    - Elements.
      - **Device Name** (*`input:text`, `required`*): The device name.
      - **Device Description** (*`input:text`*): The device description.
      - **Device Location** (*`select`*): The device description.
      - **Submit Button**: Submits the form.
        - State rules:
          - **Disabled**.
            - When:
              1. Form validation fails.
          - **Enabled**.
            - When:
              1. Otherwise.

  - **Network Setup Form.**  \
  Registers a new device.
    - Elements.
      - **SSID** (*`input:text`, `required`*): The network identifier.
      - **Password** (*`input:password`*): The network password if not public.
      - **Submit Button**: Submits the form.
        - State rules:
          - **Disabled**.
            - When:
              1. Form validation fails.
          - **Enabled**.
            - When:
              1. Otherwise.
