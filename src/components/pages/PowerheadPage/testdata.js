/* eslint quotes: 0, comma-dangle:0*/
const mockPowerheadResponse = {
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "months": [
        {
          "September": "2015-09-01"
        },
        {
          "October": "2015-10-01"
        },
        {
          "November": "2015-11-01"
        },
        {
          "December": "2015-12-01"
        }
      ],
      "value_creation": [
        1000,
        1000,
        1000,
        1000
      ],
      "orderbook": [
        10000,
        10000,
        10000,
        10000
      ],
      "overrun": [
        5,
        5,
        5,
        5
      ],
      "business_days": [
        22,
        22,
        21,
        21
      ],
      "fte": [
        10,
        10,
        10,
        10
      ],
      "bench": [
        2,
        2,
        2,
        2
      ],
      "ext_fte": [
        1.0,
        1.0,
        1.0,
        1.0
      ],
      "name": "Test-org-1",
      "expenses_per_fte_month": "5000.00",
      "days_per_week": 5,
      "hours_per_day": "7.50",
      "target_hourly_rate": "10.00",
      "country": "FI",
      "holiday_calendar": 1,
      "site": 1
    },
    {
      "id": 5,
      "months": [
        {
          "September": "2015-09-01"
        },
        {
          "October": "2015-10-01"
        },
        {
          "November": "2015-11-01"
        },
        {
          "December": "2015-12-01"
        }
      ],
      "value_creation": [
        2000,
        2000,
        2000,
        2000
      ],
      "orderbook": [
        20000,
        20000,
        20000,
        20000
      ],
      "overrun": [
        10,
        10,
        10,
        10
      ],
      "business_days": [
        22,
        22,
        21,
        21
      ],
      "fte": [
        20,
        20,
        20,
        20
      ],
      "bench": [
        3,
        3,
        3,
        3
      ],
      "ext_fte": [
        2.0,
        2.0,
        2.0,
        2.0
      ],
      "name": "Test-org-2",
      "expenses_per_fte_month": "4000.00",
      "days_per_week": 5,
      "hours_per_day": "8.00",
      "target_hourly_rate": "10.00",
      "country": "DE",
      "holiday_calendar": 2,
      "site": 3
    }
  ]
};

export default {mockPowerheadResponse};

