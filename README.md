# Train Departure Board for Home Assistant

This project provides a visualization tile for Home Assistant that displays train departure information in a format similar to the boards used by Transport for London (TFL). The tile is designed to be customizable and user-friendly, allowing users to easily view upcoming train departures.

## Features

- Displays real-time train departure information.
- Customizable settings for train routes and display options.
- Visually resembles TFL boards for an intuitive user experience.
- Integrates seamlessly with Home Assistant.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ha-train-departure-board.git
   ```

2. Navigate to the project directory:
   ```
   cd ha-train-departure-board
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Build the project:
   ```
   npm run build
   ```

5. Add the custom card to your Home Assistant configuration:
   ```yaml
   resources:
     - url: /local/ha-train-departure-board/dist/train-departure-board.js
       type: module
   ```

6. Use the custom card in your Lovelace UI:
   ```yaml
   type: 'custom:train-departure-card'
   title: Train Departures
   routes:
     - route: 'YOUR_ROUTE'
   ```

## Usage

After installation, you can customize the card settings through the Home Assistant UI. You can select the train routes you want to display and adjust other display options to suit your preferences.

## Development

To contribute to the project or make modifications:

1. Make your changes in the `src` directory.
2. Run the development server:
   ```
   npm run start
   ```
3. Test your changes in Home Assistant.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments

- Thanks to the Home Assistant community for their support and contributions.
- Inspired by the design of Transport for London (TFL) boards.