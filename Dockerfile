# Build stage
FROM python:3.9.10-slim-buster AS build
WORKDIR /app

# Copy the requirements file and install dependencies
RUN pip install numpy pandas requests python-dotenv tensorflow scikit-learn keras matplotlib

# Copy the Python project and build it
COPY ./ExRate_Service .

# Package stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS package
WORKDIR /app

# Copy the .NET 6 API and build it
COPY ExRate_API .
RUN dotnet publish -c Release -o out

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app

# Copy the Python project and its dependencies from the build stage
COPY --from=build /app ExRate_Service
COPY --from=build /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages

# Copy the .NET 6 API from the package stage
COPY --from=package /app/out ExRate_API

# Set the entry point to start the .NET 6 API
ENTRYPOINT ["dotnet", "ExRate_API/ExRate_API.dll"]
EXPOSE 80