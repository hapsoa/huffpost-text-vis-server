import dateutil.parser as dateutil_parser


def get_string_year_month_from_number(year, month):
    """
    number OOOO, OO => "OOOO-OO"
    """
    string_of_year = str(year)
    string_of_month = str(month)

    if month < 10:
        string_of_month = '0' + string_of_month
    elif month == 13:
        string_of_year = str(year + 1)
        string_of_month = '01'

    return string_of_year + '-' + string_of_month


def make_year_months_from_huff_post_data(huff_post_data):
    inner_year_months = []

    initial_date = dateutil_parser.parse(huff_post_data[0]['date'])
    last_date = dateutil_parser.parse(huff_post_data[len(huff_post_data) - 1]['date'])

    current_date = initial_date

    while current_date <= last_date:
        inner_year_months.append(get_string_year_month_from_number(current_date.year, current_date.month))
        current_date = dateutil_parser.parse(
            get_string_year_month_from_number(current_date.year, current_date.month + 1)
            + '-01'
        )

    return inner_year_months
