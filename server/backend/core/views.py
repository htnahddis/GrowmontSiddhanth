from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(["GET"])
def health_check(request):
    return Response({
        "status": "Backend running",
        "message": "Hello from Django"
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({
        "message": f"Hello {request.user.username}, you are authenticated"
    })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"detail": "Successfully logged out"},
                status=status.HTTP_205_RESET_CONTENT,
            )
        except Exception:
            return Response(
                {"error": "Invalid token"},
                status=status.HTTP_400_BAD_REQUEST,
            )